/*
 * Copyright 2015-2017 G-Labs. All Rights Reserved.
 *         https://genielabs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 *
 *  This file is part of
 *  ZUIX, Javascript library for component-based development.
 *        https://genielabs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

"use strict";

var _log =
    require('../helpers/Logger')('Localizer.js');

function Localizer() {

}

/**
 * Localize the specified element by replacing all `data-locale-id` fields
 * with the translated text.
 *
 * @param {Element} container
 * @constructor
 */
Localizer.prototype.Localize = function(container) {
    var localizables = container.querySelectorAll('[data-locale-id]');
    for (var l = 0; l < localizables.length; l++) {
        var localeId = localizables[l].getAttribute('data-locale-id');
        var text = this.getLocaleString(localeId);
        if (text != null) {
            var target = localizables[l].getAttribute('data-locale-target');
            localizables[l][target] = text;
        } else {
            // map value to innerHTML property by default
            localizables[l].innerHTML = text;
        }
    }
};

/**
 * Get translated text for element with the specified `data-locale-id` attribute.
 *
 * @param {string} localeId The `data-locale-id` identifier.
 * @param {string|undefined} [defaultText] Use this value as default if no translated text if found.
 * @param {object|undefined} [localeDictionary] Use the provided locale dictionary.
 * @return {string} The translated text.
 */
Localizer.prototype.getLocaleString = function(localeId, defaultText, localeDictionary)
{
    var retval = null;
    // try user provided locale if passed
    if (localeDictionary)
        retval = getDictionaryItem(localeId, localeDictionary);
    // try current locale
    if (retval == null)
        retval = getDictionaryItem(localeId, localesDictionary.global[currentLanguage]);
    // fallback to default locale
    if (retval == null && localesDictionary.global[currentLanguage] !== localesDictionary.global['default'] && localesDictionary.global['default'] != null)
        retval = getDictionaryItem(localeId, localesDictionary.global['default']);
    if (retval == null)
        _log.w('WARNING (Locales.GetLocaleString): "' + localeId + '" is undefined.');
    return (retval == null && defaultText ? defaultText : retval);
};

/**
 * Get client language settings.
 *
 * @return {string} Locale identifier string (eg. 'en' ,'fr', 'it', ...)
 */
Localizer.prototype.getUserLanguage = function () {
    var userLang = (navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage));
    if (userLang.length > 2) userLang = userLang.substring(0, 2);
    return userLang;
};

/**
 * Get client date format endian type. This value can be used as a rough-guess of other locale settings such as measuring units.
 * @return {string} 'L' if date format is 'Little Endian -> DMY' or 'M' for 'Middle Endian -> MDY'
 */
Localizer.prototype.getDateEndianType = function () {
    // L = Little Endian -> DMY
    // M = Middle Endian -> MDY
    var endianType = 'L';
    var testDate = new Date(98326800000);
    var localeDateParts = testDate.toLocaleDateString().replace(/[\u200E]/g, "").split('/');
    if (localeDateParts[0] == '2') endianType = 'M';
    return endianType;
};

// TODO: Add the following missing methods...
// Localizer.prototype.loadDictionary = function(langurl, callback) { ... }
// Localizer.prototype.loadDefault = function(callback) { ... }
/*
 TODO: getMeasuringUnits ...
 $$.getTemperatureUnit = function()
 {
 var temperatureUnit = HG.WebApp.Store.get('UI.TemperatureUnit');
 if (temperatureUnit != 'C' && (temperatureUnit == 'F' || $$.GetDateEndianType() == 'M'))
 return 'Fahrenheit';
 else
 return 'Celsius';
 };
 */

module.exports = Localizer;


// ---------------------------------------------


var currentLanguage = 'default';
var localesDictionary = {};

/*
// example locale dictionary instance
localesDictionary['global'] = {
    default: this.en,
    en: {
        'abc': 'def',
        'ghi': 'jkl'
    },
    it: {
        'abc': 'pippo',
        'ghi': 'pluto',
        'example': function (el, localeID) {

        }
    }
};
localesDictionary['other-scope'] = {
    // ...
};
*/

function getDictionaryItem(localeId, localeDictionary) {
    for (var id in localeDictionary)
        if (id == localeId)
            return localeDictionary[id];
}
