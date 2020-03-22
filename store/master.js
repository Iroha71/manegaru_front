export const state = () => ({
    choisableSeasons: [
        { name: '季節に合わせる', value: 'match' },
        { name: '春', value: 'spring' },
        { name: '夏', value: 'summer'},
        { name: '秋', value: 'fall' },
        { name: '冬', value: 'winnter'}
    ],
    personalPronouns: [ {name: '私', value: '私'}, {name: '俺', value: '俺'}, {name: '僕', value: '僕'} ]
})

export const getters = {
    choisableSeasons: (state) => state.choisableSeasons,
    personalPronouns: (state) => state.personalPronouns
}