import { fromCSV, Series } from 'data-forge';
import { parse, format, addDays } from 'date-fns';
import LeastSquares from 'least-squares';
import countryLookup from './countryLookup';

const dataUrls = {
    'cases': 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv',
    'deaths': 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv'
};

const dataCache = {};

async function loadData (dataType) {
    if (dataCache[dataType]) {
        return dataCache[dataType];
    }

    const response = await fetch(dataUrls[dataType]);
    const data = await response.text();

    let df = fromCSV(data, { dynamicTyping: true });

    df = df.generateSeries({
        'country': r => {
            if (r['Province/State'] === 'Hong Kong') {
                return 'Hong Kong';
            } else {
                return r['Country/Region'];
            }
        }
    });

    dataCache[dataType] = df;

    return dataCache[dataType];
}

function findGradient (xSeries, ySeries) {
    const params = {};

    LeastSquares(xSeries, ySeries, params);

    return params.m;
}

function generateDates (fromDate, toDate) {
    const dates = [];
    let currentDate = fromDate;

    while (currentDate <= toDate) {
        dates.push(format(currentDate, 'M/d/yy'));

        currentDate = addDays(currentDate, 1);
    }

    return dates;
}

export async function getCountryRates (dataType, dateRange, scale = 'linear') {
    const dfAll = await loadData(dataType);

    const lastDate = parse(dfAll.getColumnNames().slice(-2, -1).pop(), 'M/d/yy', new Date());

    let fromDate;
    let toDate;

    if (dateRange) {
        [fromDate, toDate] = dateRange;
    } else {
        toDate = lastDate;
        fromDate = addDays(lastDate, -7);
    }

    const dates = generateDates(fromDate, toDate);
    const summarizer = dates.reduce((result, next) => ({ ...result, [next]: Series.sum }), {});

    const dfPeriod = dfAll.subset(['country', ...dates]);

    const result = [];

    for (const dfCountry of dfPeriod.groupBy(r => r['country'])) {
        const countryName = dfCountry.first()['country'];
        const countryId = countryLookup[countryName];

        if (!countryId) {
            continue;
        }

        const countryData = dfCountry.dropSeries('country').summarize(summarizer);

        const confirmedCases = Object.values(countryData).map(d => +d);
        const newCases = confirmedCases.reduce((result, next) => [...result, result.length ? next - confirmedCases[result.length - 1] : 0], []).slice(1);

        const seriesTransform = n => scale === 'logarithmic' ? Math.log10(n === 0 ? 1 : n) : n;

        const x = confirmedCases.slice(1).map(seriesTransform);
        const y = newCases.map(seriesTransform);

        const gradient = findGradient(x, y);

        if (isNaN(gradient)) {
            console.log('Gradient invalid for: ', countryName);
            continue;
        }

        result.push({ id: countryId, gradient });
    }

    return { result, lastDate };
}
