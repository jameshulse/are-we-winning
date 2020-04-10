import { fromCSV, Series } from 'data-forge';
import { parse, format, addDays } from 'date-fns';
import LeastSquares from 'least-squares';
import countryLookup from './countryLookup';

const casesUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
const deathsUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv';

export async function loadData (dataType, period = 7) {
    const response = await fetch(dataType === 'cases' ? casesUrl : deathsUrl);
    const data = await response.text();

    const dfAll = fromCSV(data);

    const lastDate = parse(dfAll.getColumnNames().slice(-1).pop(), 'M/d/yy', new Date());
    const dates = Array.from({ length: period + 1 }, (_, i) => format(addDays(lastDate, -period + i), 'M/d/yy'));
    const summarizer = dates.reduce((result, next) => ({ ...result, [next]: Series.sum }), {});

    const dfPeriod = dfAll.subset(['Country/Region', ...dates]);

    const result = [];

    for (const dfCountry of dfPeriod.groupBy(r => r['Country/Region'])) {
        const countryName = dfCountry.first()['Country/Region'];
        const countryId = countryLookup[countryName];

        if (!countryId) {
            continue;
        }

        const countryData = dfCountry.dropSeries('Country/Region').summarize(summarizer);

        const confirmedCases = Object.values(countryData).map(d => +d);
        const newCases = confirmedCases.reduce((result, next) => [...result, result.length ? next - confirmedCases[result.length - 1] : 0], []).slice(1);

        const x = confirmedCases.slice(1).map(n => Math.log10(n)); // Drop extra day and apply logarithmic
        const y = newCases.map(n => Math.log10(n === 0 ? 1 : n));

        const params = {};

        LeastSquares(x, y, params);

        const gradient = params.m;

        if (isNaN(gradient)) {
            console.log('Gradient invalid for: ', countryName);
            continue;
        }

        result.push({ id: countryId, gradient });
    }

    return result;
}
