import { fromCSV } from 'data-forge';
import LeastSquares from 'least-squares';
import countryLookup from './countryLookup';

const dataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';

function getStatus (df, country, period = 14) {
    const countryData = df.where(row => row['Country/Region'] === country && row['Province/State'] === '');

    if (countryData.count() > 1) {
        throw new Error('Can\t analyse with more than one Country row');
    }

    const recentDayColumns = countryData.getColumnNames().slice(-(period + 1)); // Take one extra day to calculate new cases

    const confirmedCases = countryData.subset(recentDayColumns).toRows()[0].map(d => +d);
    const newCases = confirmedCases.reduce((result, next) => [...result, result.length ? next - confirmedCases[result.length - 1] : 0], []).slice(1);

    const x = confirmedCases.slice(1).map(n => Math.log10(n)); // Drop extra day and apply logarithmic
    const y = newCases.map(n => Math.log10(n === 0 ? 1 : n));

    const params = {};

    LeastSquares(x, y, params);

    console.log(params);

    return params.m < 1 ? 'winning' : 'losing';
}

export async function load () {
        const response = await fetch(dataUrl);
        const data = await response.text();

        df = fromCSV(data).setIndex('Country/Region');

        const countries = df.select(r => r['Country/Region']).distinct().toArray();
        const result = [];

        for (var i = 0; i < countries.length; i++) {
            const countryName = countries[i];
            const countryId = countryLookup[countryName];

            if (!countryId) {
                continue;
            }
        }
}
