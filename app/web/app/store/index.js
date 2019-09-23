'use strict';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const files = require.context('./modules', false, /\.js$/);

export default function createStore(initState = {}) {

    const modules = files.keys().reduce((map, key) => {
        let part = files(key).default;
        if (typeof part === 'function') {
            part = part(initState)
        }
        let name = part.name || key.match(/\.\/(\S*)\.js/)[1];
        part.namespaced = true;
        map[name] = part;
        return map;
    }, {});

    const store = new Vuex.Store({
        state: { ...initState },
        modules,
    });

    return store;
};
