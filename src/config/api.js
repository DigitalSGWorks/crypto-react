import axios from "axios";

// Base URL for CoinGecko API
const BASE_URL = 'https://api.coingecko.com/api/v3';

// Get list of all coins with market data
export const CoinList = (currency, perPage = 100, page = 1) =>
    `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&locale=en`;

// Get detailed data for a specific coin
export const SingleCoin = (id) =>
    `${BASE_URL}/coins/${id}`;

// Get historical market data for a coin
export const HistoricalChart = (id, days = 365, currency) =>
    `${BASE_URL}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;

// Get trending coins (top 7 trending coins in the last 24 hours)
export const TrendingCoins = () =>
    `${BASE_URL}/search/trending`;

// Get global cryptocurrency market data
export const GlobalData = () =>
    `${BASE_URL}/global`;

// Get supported vs currencies
export const SupportedVsCurrencies = () =>
    `${BASE_URL}/simple/supported_vs_currencies`;

// Get exchange rates (USD to other currencies)
export const ExchangeRates = () =>
    `${BASE_URL}/exchange_rates`;

// Get BTC-to-Currency Exchange Rates
export const BTCExchangeRates = () =>
    `${BASE_URL}/exchange_rates`;

// Get coin price by ID
export const CoinPrice = (id, currency) =>
    `${BASE_URL}/simple/price?ids=${id}&vs_currencies=${currency}`;

// Get coin price by contract address
export const CoinPriceByContract = (contractAddress, currency, platform = 'ethereum') =>
    `${BASE_URL}/simple/token_price/${platform}?contract_addresses=${contractAddress}&vs_currencies=${currency}`;

// Get exchanges list
export const ExchangesList = () =>
    `${BASE_URL}/exchanges`;

// Get exchange data by ID
export const ExchangeData = (id) =>
    `${BASE_URL}/exchanges/${id}`;

// Get NFT categories
export const NFTCategories = () =>
    `${BASE_URL}/nfts/categories`;

// Get NFT collections
export const NFTCollections = () =>
    `${BASE_URL}/nfts/collections`;

// Get asset platforms (blockchains)
export const AssetPlatforms = () =>
    `${BASE_URL}/asset_platforms`;

export async function fetchExchangeRates(){
    try {
        console.log('[API] Récupération des taux de change...')
        const {data} = await axios.get(ExchangeRates())
        console.log('[API] Taux de change reçus:', {
            nombreDevises: Object.keys(data.rates).length,
            devisesDisponibles: Object.keys(data.rates).slice(0, 10), // Affiche les 10 premières
            structure: Object.keys(data)
        })
        return data.rates
    } catch (error) {
        console.error('[API] Erreur lors de la récupération des taux:', error)
        throw error
    }
}

export function btcPricesIn(rates, codes){
    const out = {}
  codes.forEach((code) => {
    const r = rates[code.toLowerCase()]
    if (!r) return
    const formatted =
      r.type === "fiat"
        ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: code.toUpperCase() }).format(r.value)
        : new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 8 }).format(r.value) + " " + r.unit
    out[code] = { value: r.value, unit: r.unit, formatted }
  })
  return out
}
/*
export function convert(amount, fromCode, toCode, rates){
    const from = rates[fromCode.toLowerCase()]
  const to = rates[toCode.toLowerCase()]
  if (!from || !to) throw new Error("Devise inconnue")

  const value = (amount / from.value) * to.value
  const formatted =
    to.type === "fiat"
      ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: toCode.toUpperCase() }).format(value)
      : new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 8 }).format(value) + " " + to.unit

  return { value, unit: to.unit, formatted } 
}*/

export function convert(amount, from, to, rates) {
    const r = rates.rates ? rates.rates : rates // selon ce que tu stockes
    const fromKey = String(from).toLowerCase()
    const toKey   = String(to).toLowerCase()
  
    const fromRate = r?.[fromKey]?.value
    const toRate   = r?.[toKey]?.value
    if (typeof fromRate !== 'number' || typeof toRate !== 'number') {
      throw new Error(`Missing rate for ${fromKey} or ${toKey}`)
    }
    // les valeurs sont "par BTC", donc on applique le ratio
    const value = amount * (toRate / fromRate)
    return { value }
  }