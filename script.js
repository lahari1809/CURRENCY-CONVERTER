document.addEventListener('DOMContentLoaded', () => {
    
    const amountInput = document.getElementById('amount');
    const fromCurrencySelect = document.getElementById('fromCurrency');
    const toCurrencySelect = document.getElementById('toCurrency');
    const convertBtn = document.getElementById('convertBtn');
    const convertedAmountSpan = document.getElementById('convertedAmount');
    const swapBtn = document.getElementById('swapBtn');
    const fromFlag = document.getElementById('fromFlag');
    const toFlag = document.getElementById('toFlag');

    
    const convertedSymbolDisplay = document.getElementById('convertedSymbolDisplay');
    const convertedSymbol = document.getElementById('convertedSymbol');
    const convertedCountryName = document.getElementById('convertedCountryName'); 
    const convertedValue = document.getElementById('convertedValue');


    // --- API Configuration ---
    
    const API_KEY = 'b7ee46150fa502727845c5cf'; // Your API Key
    const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`;
    const FLAG_BASE_URL = 'https://flagcdn.com/w20/';

    // --- Extended Mapping: Currency Codes to Country Codes ---
    // This map helps find the correct flag for a given currency.
    const currencyToCountryCodeMap = {
        'USD': 'us', 'INR': 'in', 'GBP': 'gb', 'EUR': 'eu', // Common Eurozone flag
        'AUD': 'au', 'CAD': 'ca', 'JPY': 'jp', 'CNY': 'cn',
        'CHF': 'ch', 'NZD': 'nz', 'SGD': 'sg', 'HKD': 'hk',
        'KRW': 'kr', 'SEK': 'se', 'NOK': 'no', 'DKK': 'dk',
        'RUB': 'ru', 'BRL': 'br', 'MXN': 'mx', 'ZAR': 'za',
        'SAR': 'sa', 'AED': 'ae', 'LKR': 'lk', 'PKR': 'pk',
        'BDT': 'bd', 'NPR': 'np', 'IDR': 'id', 'MYR': 'my',
        'PHP': 'ph', 'THB': 'th', 'VND': 'vn', 'EGP': 'eg',
        'NGN': 'ng', 'KES': 'ke', 'GHS': 'gh', 'TRY': 'tr',
        'PLN': 'pl', 'CZK': 'cz', 'HUF': 'hu', 'ILS': 'il',
        'CLP': 'cl', 'COP': 'co', 'PEN': 'pe', 'ARS': 'ar',
        'KWD': 'kw', 'QAR': 'qa', 'OMR': 'om', 'BHD': 'bh',
        'DKK': 'dk', 'XCD': 'ag', // Eastern Caribbean Dollar - using Antigua's flag as representative
        'JMD': 'jm', 'TTD': 'tt', 'UGX': 'ug', 'TZS': 'tz',
        'DZD': 'dz', 'MAD': 'ma', 'SEK': 'se', 'NOK': 'no',
        'ISK': 'is', 'PHP': 'ph', 'RON': 'ro', 'BGN': 'bg',
        'HRK': 'hr', 'RSD': 'rs', 'UAH': 'ua', 'AZN': 'az',
        'GEL': 'ge', 'KZT': 'kz', 'UZS': 'uz', 'KGS': 'kg',
        'BYN': 'by', 'AMD': 'am', 'MDL': 'md', 'ALL': 'al',
        'BAM': 'ba', 'MKD': 'mk', 'FJD': 'fj', 'PGK': 'pg',
        'SBD': 'sb', 'VUV': 'vu', 'WST': 'ws', 'TOP': 'to',
        'TWD': 'tw', 'VND': 'vn', 'LAK': 'la', 'KHR': 'kh',
        'MMK': 'mm', 'MNT': 'mn', 'NIO': 'ni', 'PYG': 'py',
        'UYU': 'uy', 'GMD': 'gm', 'XOF': 'sn', // West African CFA franc - using Senegal's flag
        'XAF': 'cm', // Central African CFA franc - using Cameroon's flag
        'MZN': 'mz', 'ZMW': 'zm', 'MWK': 'mw', 'CVE': 'cv',
        'DJF': 'dj', 'ERN': 'er', 'ETB': 'et', 'GMD': 'gm',
        'GNF': 'gn', 'LRD': 'lr', 'LSL': 'ls', 'MGA': 'mg',
        'MRO': 'mr', 'MUR': 'mu', 'NAD': 'na', 'RWF': 'rw',
        'SCR': 'sc', 'SHP': 'sh', 'SLL': 'sl', 'SOS': 'so',
        'SSP': 'ss', 'STD': 'st', 'SZL': 'sz', 'TND': 'tn',
        'TZS': 'tz', 'XAF': 'cm', 'XOF': 'sn', 'ZMW': 'zm',
        'ZWL': 'zw', 'BZD': 'bz', 'HTG': 'ht', 'GYD': 'gy',
        'SRD': 'sr', 'BWP': 'bw', 'GIP': 'gi', 'FKP': 'fk',
        'CUP': 'cu', 'CUC': 'cu', // Cuban Peso and Convertible Peso
        'VES': 've', // Venezuelan Bolívar Soberano
    };

    // --- Extended Mapping: Country Codes to Country Names ---
    // Provides the full name for the country based on its 2-letter code.
    const countryCodeToCountryNameMap = {
        'us': 'United States', 'in': 'India', 'gb': 'United Kingdom',
        'eu': 'Eurozone', 'au': 'Australia', 'ca': 'Canada',
        'jp': 'Japan', 'cn': 'China', 'ch': 'Switzerland',
        'nz': 'New Zealand', 'sg': 'Singapore', 'hk': 'Hong Kong',
        'kr': 'South Korea', 'se': 'Sweden', 'no': 'Norway',
        'dk': 'Denmark', 'ru': 'Russia', 'br': 'Brazil',
        'mx': 'Mexico', 'za': 'South Africa', 'sa': 'Saudi Arabia',
        'ae': 'United Arab Emirates', 'lk': 'Sri Lanka', 'pk': 'Pakistan',
        'bd': 'Bangladesh', 'np': 'Nepal', 'id': 'Indonesia',
        'my': 'Malaysia', 'ph': 'Philippines', 'th': 'Thailand',
        'vn': 'Vietnam', 'eg': 'Egypt', 'ng': 'Nigeria',
        'ke': 'Kenya', 'gh': 'Ghana', 'tr': 'Turkey', 'pl': 'Poland',
        'cz': 'Czech Republic', 'hu': 'Hungary', 'il': 'Israel',
        'cl': 'Chile', 'co': 'Colombia', 'pe': 'Peru',
        'ar': 'Argentina', 'kw': 'Kuwait', 'qa': 'Qatar',
        'om': 'Oman', 'bh': 'Bahrain', 'ag': 'Antigua and Barbuda',
        'jm': 'Jamaica', 'tt': 'Trinidad and Tobago', 'ug': 'Uganda',
        'tz': 'Tanzania', 'dz': 'Algeria', 'ma': 'Morocco',
        'is': 'Iceland', 'ro': 'Romania', 'bg': 'Bulgaria',
        'hr': 'Croatia', 'rs': 'Serbia', 'ua': 'Ukraine',
        'az': 'Azerbaijan', 'ge': 'Georgia', 'kz': 'Kazakhstan',
        'uz': 'Uzbekistan', 'kg': 'Kyrgyzstan', 'by': 'Belarus',
        'am': 'Armenia', 'md': 'Moldova', 'al': 'Albania',
        'ba': 'Bosnia and Herzegovina', 'mk': 'North Macedonia', 'fj': 'Fiji',
        'pg': 'Papua New Guinea', 'sb': 'Solomon Islands', 'vu': 'Vanuatu',
        'ws': 'Samoa', 'to': 'Tonga', 'tw': 'Taiwan', 'la': 'Laos',
        'kh': 'Cambodia', 'mm': 'Myanmar', 'mn': 'Mongolia', 'ni': 'Nicaragua',
        'py': 'Paraguay', 'uy': 'Uruguay', 'gm': 'Gambia', 'sn': 'Senegal',
        'cm': 'Cameroon', 'mz': 'Mozambique', 'zm': 'Zambia', 'mw': 'Malawi',
        'cv': 'Cape Verde', 'dj': 'Djibouti', 'er': 'Eritrea', 'et': 'Ethiopia',
        'gn': 'Guinea', 'lr': 'Liberia', 'ls': 'Lesotho', 'mg': 'Madagascar',
        'mr': 'Mauritania', 'mu': 'Mauritius', 'na': 'Namibia', 'rw': 'Rwanda',
        'sc': 'Seychelles', 'sh': 'Saint Helena', 'sl': 'Sierra Leone', 'so': 'Somalia',
        'ss': 'South Sudan', 'st': 'Sao Tome and Principe', 'sz': 'Eswatini', 'tn': 'Tunisia',
        'zw': 'Zimbabwe', 'bz': 'Belize', 'ht': 'Haiti', 'gy': 'Guyana',
        'sr': 'Suriname', 'bw': 'Botswana', 'gi': 'Gibraltar', 'fk': 'Falkland Islands',
        'cu': 'Cuba', 've': 'Venezuela',
        'un': 'Unknown' // Fallback for truly unknown flags/countries
    };

    // --- Extended Mapping: Currency Codes to Currency Symbols ---
    // Provides the correct symbol for a given currency.
    const currencySymbolMap = {
        'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'INR': '₹',
        'AUD': 'A$', 'CAD': 'C$', 'CHF': 'Fr.', 'CNY': '¥',
        'HKD': 'HK$', 'NZD': 'NZ$', 'SGD': 'S$', 'KRW': '₩',
        'BRL': 'R$', 'MXN': 'Mex$', 'ZAR': 'R', 'RUB': '₽',
        'TRY': '₺', 'SEK': 'kr', 'NOK': 'kr', 'DKK': 'kr',
        'PLN': 'zł', 'CZK': 'Kč', 'HUF': 'Ft', 'ILS': '₪',
        'CLP': 'CLP$', 'COP': 'COL$', 'PEN': 'S/', 'ARS': '$',
        'EGP': 'E£', 'SAR': '﷼', 'AED': 'د.إ', 'LKR': 'Rs',
        'PKR': 'Rs', 'BDT': '৳', 'NPR': 'रू', 'IDR': 'Rp',
        'MYR': 'RM', 'PHP': '₱', 'THB': '฿', 'VND': '₫',
        'NGN': '₦', 'KES': 'KSh', 'GHS': '₵', 'KWD': 'KD',
        'QAR': 'QR', 'OMR': 'RO', 'BHD': 'BD', 'ISK': 'kr',
        'RON': 'lei', 'BGN': 'лв', 'HRK': 'kn', 'RSD': 'дин.',
        'UAH': '₴', 'AZN': '₼', 'GEL': '₾', 'KZT': '₸',
        'UZS': 'сум', 'KGS': 'сом', 'BYN': 'Br', 'AMD': '֏',
        'MDL': 'L', 'ALL': 'Lek', 'BAM': 'KM', 'MKD': 'ден',
        'FJD': 'FJ$', 'PGK': 'K', 'SBD': 'SI$', 'VUV': 'Vt',
        'WST': 'WS$', 'TOP': 'T$', 'TWD': 'NT$', 'LAK': '₭',
        'KHR': '៛', 'MMK': 'K', 'MNT': '₮', 'NIO': 'C$',
        'PYG': '₲', 'UYU': '$U', 'GMD': 'D', 'XOF': 'CFA',
        'XAF': 'CFA', 'MZN': 'MT', 'ZMW': 'ZK', 'MWK': 'MK',
        'CVE': 'Esc', 'DJF': 'Fdj', 'ERN': 'Nfk', 'ETB': 'Br',
        'GNF': 'FG', 'LRD': 'L$', 'LSL': 'L', 'MGA': 'Ar',
        'MRO': 'UM', 'MUR': 'Rs', 'NAD': 'N$', 'RWF': 'Fr',
        'SCR': 'Rs', 'SHP': '£', 'SLL': 'Le', 'SOS': 'Sh',
        'SSP': '£', 'STD': 'Db', 'SZL': 'L', 'TND': 'DT',
        'TZS': 'TSh', 'ZWL': 'Z$', 'BZD': 'BZ$', 'HTG': 'G',
        'GYD': 'GY$', 'SRD': 'Sr$', 'BWP': 'P', 'GIP': '£',
        'FKP': '£', 'CUP': '₱', 'CUC': 'CUC$', 'VES': 'Bs.S',
        'default': (code) => code // Fallback to display the code if symbol is unknown
    };

    // Helper function to get the flag code based on currency code
    function getFlagCode(currencyCode) {
        if (currencyToCountryCodeMap[currencyCode]) {
            return currencyToCountryCodeMap[currencyCode];
        }
        // Fallback: Use the first two letters of the currency code as a country code
        // This works for many but not all (e.g., XAU, XDR, or currencies not directly tied to a single country like EUR)
        if (currencyCode.length >= 2) {
            return currencyCode.substring(0, 2).toLowerCase();
        }
        return 'un'; // 'un' is a placeholder for unknown flags
    }

    function updateFlags() {
        const fromCurrencyCode = fromCurrencySelect.value;
        const toCurrencyCode = toCurrencySelect.value;

        const fromFlagCode = getFlagCode(fromCurrencyCode);
        const toFlagCode = getFlagCode(toCurrencyCode);

        fromFlag.src = `${FLAG_BASE_URL}${fromFlagCode}.png`;
        fromFlag.onerror = () => {
            fromFlag.src = 'https://flagcdn.com/w20/un.png';
            console.warn(`Flag not found for: ${fromCurrencyCode} (mapped to ${fromFlagCode}). Using placeholder for 'From' flag.`);
        };

        toFlag.src = `${FLAG_BASE_URL}${toFlagCode}.png`;
        toFlag.onerror = () => {
            toFlag.src = 'https://flagcdn.com/w20/un.png';
            console.warn(`Flag not found for: ${toCurrencyCode} (mapped to ${toFlagCode}). Using placeholder for 'To' flag.`);
        };
    }

    
    async function populateCurrencies() {
        try {
            const response = await fetch(`${BASE_URL}USD`);
            const data = await response.json();

            if (data.result === 'success' && data.conversion_rates) {
                const currencies = Object.keys(data.conversion_rates);
                currencies.sort();

                fromCurrencySelect.innerHTML = '';
                toCurrencySelect.innerHTML = '';

                currencies.forEach(currencyCode => {
                    const option1 = document.createElement('option');
                    option1.value = currencyCode;
                    option1.textContent = currencyCode;
                    fromCurrencySelect.appendChild(option1);

                    const option2 = document.createElement('option');
                    option2.value = currencyCode;
                    option2.textContent = currencyCode;
                    toCurrencySelect.appendChild(option2);

                    option2.style.backgroundColor = '#383838'; 
                    option2.style.color = '#eee';
                });

                fromCurrencySelect.value = 'USD';
                toCurrencySelect.value = 'INR';

                updateFlags();
                
            } else {
                convertedAmountSpan.textContent = 'Error fetching currencies. Please check your API key or API response format.';
                console.error('Error fetching currencies:', data);
            }
        } catch (error) {
            convertedAmountSpan.textContent = 'Network error. Could not connect to currency API.';
            console.error('Fetch error during currency population:', error);
        }
    }

    
    async function convertCurrency() {
        const amount = parseFloat(amountInput.value);
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;

        if (isNaN(amount) || amount < 0) {
            convertedAmountSpan.textContent = 'Please enter a valid amount.';
            convertedSymbolDisplay.classList.remove('visible'); 
            convertedCountryName.textContent = ''; 
            return;
        }

        // Get country code for the 'to' currency
        const toCountryCode = getFlagCode(toCurrency);
        // Get country name using the country code
        const countryName = countryCodeToCountryNameMap[toCountryCode] || 'Unknown Country'; 
        // Get currency symbol
        const symbol = currencySymbolMap[toCurrency] || currencySymbolMap.default(toCurrency);

        if (fromCurrency === toCurrency) {
            const displayAmount = amount.toFixed(2);
            convertedAmountSpan.textContent = `${displayAmount}`; 
            convertedSymbol.textContent = symbol; 
            convertedCountryName.textContent = countryName; 
            convertedValue.textContent = displayAmount; 
            convertedSymbolDisplay.classList.add('visible'); 
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}${fromCurrency}`);
            const data = await response.json();

            if (data.result === 'success' && data.conversion_rates && data.conversion_rates[toCurrency]) {
                const exchangeRate = data.conversion_rates[toCurrency];
                const converted = (amount * exchangeRate).toFixed(2);
                
                convertedAmountSpan.textContent = `${converted}`; 
                convertedSymbol.textContent = symbol; 
                convertedCountryName.textContent = countryName; 
                convertedValue.textContent = converted; 
                convertedSymbolDisplay.classList.add('visible'); 

            } else {
                convertedAmountSpan.textContent = 'Error getting exchange rate.';
                convertedSymbolDisplay.classList.remove('visible'); 
                convertedCountryName.textContent = ''; 
                console.error('Error fetching conversion rate:', data);
            }
        } catch (error) {
            convertedAmountSpan.textContent = 'Network error. Could not convert.';
            convertedSymbolDisplay.classList.remove('visible'); 
            convertedCountryName.textContent = ''; 
            console.error('Fetch error during conversion:', error);
        }
    }

    
    function swapCurrencies() {
        const tempFrom = fromCurrencySelect.value;
        const tempTo = toCurrencySelect.value;

        fromCurrencySelect.value = tempTo;
        toCurrencySelect.value = tempFrom;

        updateFlags();
        convertedAmountSpan.textContent = '0.00'; 
        convertedSymbolDisplay.classList.remove('visible'); 
        convertedCountryName.textContent = ''; 
    }

    // --- Event Listeners ---
    convertBtn.addEventListener('click', convertCurrency);

    amountInput.addEventListener('input', () => {
        convertedAmountSpan.textContent = '0.00';
        convertedSymbolDisplay.classList.remove('visible'); 
        convertedCountryName.textContent = ''; 
    });

    fromCurrencySelect.addEventListener('change', () => {
        updateFlags();
        convertedAmountSpan.textContent = '0.00';
        convertedSymbolDisplay.classList.remove('visible'); 
        convertedCountryName.textContent = ''; 
    });

    toCurrencySelect.addEventListener('change', () => {
        updateFlags();
        convertedAmountSpan.textContent = '0.00';
        convertedSymbolDisplay.classList.remove('visible'); 
        convertedCountryName.textContent = ''; 
    });

    swapBtn.addEventListener('click', swapCurrencies);

    // Initial population of currencies when the page loads
    populateCurrencies();
});
