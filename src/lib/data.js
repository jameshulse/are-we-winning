import { fromCSV } from 'data-forge';
import LeastSquares from 'least-squares';
import countryLookup from './countryLookup';

const dataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';

function getGradient (countryData, period) {
    const recentDayColumns = countryData.getColumnNames().slice(-(period + 1)); // Take one extra day to calculate new cases

    const confirmedCases = countryData.subset(recentDayColumns).toRows()[0].map(d => +d);
    const newCases = confirmedCases.reduce((result, next) => [...result, result.length ? next - confirmedCases[result.length - 1] : 0], []).slice(1);

    const x = confirmedCases.slice(1).map(n => Math.log10(n)); // Drop extra day and apply logarithmic
    const y = newCases.map(n => Math.log10(n === 0 ? 1 : n));

    const params = {};

    LeastSquares(x, y, params);

    return params.m;
}

export async function loadData (period = 7) {
    const response = await fetch(dataUrl);
    const data = await response.text();

    const df = fromCSV(data).setIndex('Country/Region');

    const countries = df.select(r => r['Country/Region']).distinct().toArray();
    const result = [];

    for (var i = 0; i < countries.length; i++) {
        const countryName = countries[i];
        const countryId = countryLookup[countryName];

        if (!countryId) {
            continue;
        }

        const countryData = df.where(row => row['Country/Region'] === countryName && row['Province/State'] === '');

        if (countryData.count() === 0) {
            console.log('Country data not found:', countryName);
            continue;
        } else if (countryData.count() > 1) {
            console.log('Too many data points for county: ', countryName);
            continue;
        }

        const gradient = getGradient(countryData, period);

        if (isNaN(gradient)) {
            console.log('Gradient invalid for: ', countryName);
            continue;
        }

        result.push({ id: countryId, gradient });
    }

    return result;
}
