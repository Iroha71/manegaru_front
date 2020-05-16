
export const state = () => ({
    TAB: {
        APP: 'appSetting',
        USER: 'userInfo',
        LINE: 'lineCoop'
    },
    choisableSeasons: [
        { name: '季節に合わせる', value: 'match' },
        { name: '春', value: 'spring' },
        { name: '夏', value: 'summer'},
        { name: '秋', value: 'fall' },
        { name: '冬', value: 'winnter'}
    ],
    personalPronouns: [ {name: '私', value: '私'}, {name: '俺', value: '俺'}, {name: '僕', value: '僕'} ],
    datePickerMonthNames: [ '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月' ],
    STATUS_LABEL: {
        YET: '未着手',
        WORKING: '作業中',
        FINISHED: '完了'
    },
    NOTIFY_INTERVAL: {
        DAY: { LABEL: '毎日', VALUE: 'day' },
        WEEK: { LABEL: '毎週', VALUE: 'week' },
        MONTH: { LABEL: '毎月', VALUE: 'month' }
    }
})

export const getters = {
    choisableSeasons: (state) => state.choisableSeasons,
    personalPronouns: (state) => state.personalPronouns,
    monthNames: (state) => state.datePickerMonthNames,
    STATUS_LABEL: (state) => state.STATUS_LABEL,
    STATUS_LABELS: (state) => [state.STATUS_LABEL.YET, state.STATUS_LABEL.WORKING, state.STATUS_LABEL.FINISHED],
    NOTIFY_INTERVAL: (state) => state.NOTIFY_INTERVAL,
    TAB: (state) => state.TAB
}