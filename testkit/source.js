"use strict"
/**
 * Collection of test cases
 **/

/* Configuration */

const amount = "10.1"
const assetCode = "ASSET"
const base64 = "BOOM"
const base64WithNull = "AAA"
const domain = "example.org"
const hash = "0a0a9f2a6772942557ab5355d76af442f8f65e010a0a9f2a6772942557ab5355"
const name = "hello"
const noop = "setOptions"
const number = "1234567890"
const price = "1.1"
const pubkey = "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF"
const text = "Hello_World!"
const weight = "20"

const asset = `${assetCode}:${pubkey}`
const asset4 = `ABCD:${pubkey}`
const asset12 = `ABCDEFGHIJKL:${pubkey}`
const assetNeutral = `XLM:${pubkey}`
const path1 = `${assetCode}1:${pubkey}`
const path5 = `${path1},${assetCode}2:${pubkey},${assetCode}3:${pubkey},${assetCode}4:${pubkey},${assetCode}5:${pubkey}`

/* Data */

const data = [
  /* Parameters */
  // Generic
  {
    name: "Source",
    query: `?type=${noop}&source=${pubkey}`
  },
  {
    name: "Fee",
    query: `?type=${noop}&fee=500`
  },

  // Memo
  {
    name: "Memo/text",
    query: `?type=${noop}&memo=${text}`
  },
  {
    name: "Memo/text (binary)",
    query: `?type=${noop}&memo=base64:${base64}`
  },
  {
    name: "Memo/text (binary/NULL)",
    query: `?type=${noop}&memo=base64:${base64WithNull}`
  },
  {
    name: "Memo/id",
    query: `?type=${noop}&memo=id:${number}`
  },
  {
    name: "Memo/hash",
    query: `?type=${noop}&memo=hash:${hash}`
  },
  {
    name: "Memo/return",
    query: `?type=${noop}&memo=return:${hash}`
  },

  // Timebounds
  {
    name: "MinTime",
    query: `?type=${noop}&minTime=2001-01-01`
  },
  {
    name: "MinTime (minutes)",
    query: `?type=${noop}&minTime=2001-01-01T01:01`
  },
  {
    name: "MinTime (minutes UTC)",
    query: `?type=${noop}&minTime=2001-01-01T01:01Z`,
    queryConverted: `?type=${noop}&minTime=2001-01-01T01:01`
  },
  {
    name: "MinTime (minutes+timezone)",
    query: `?type=${noop}&minTime=2001-01-01T11:00+01:00`,
    queryConverted: `?type=${noop}&minTime=2001-01-01T10:00`
  },
  {
    name: "MaxTime",
    query: `?type=${noop}&maxTime=2030-01-01`
  },
  {
    name: "MaxTime (relative)",
    query: `?type=${noop}&maxTime=+3`,
    noConversion: true
  },
  {
    name: "MinTime+MaxTime",
    query: `?type=${noop}&minTime=2017-01-01&maxTime=2030-01-01`
  },

  /* Meta-parameters */
  {
    name: "Network",
    query: `?type=${noop}&network=test`
  },
  {
    name: "Horizon",
    query: `?type=${noop}&network=multisig&horizon=${domain}`,
    noXdr: true
  },
  {
    name: "Callback",
    query: `?type=${noop}&callback=${domain}`
  },

  /* Account Merge */
  {
    name: "Account Merge",
    query: `?type=accountMerge&destination=${pubkey}`
  },

  /* Allow Trust */
  {
    name: "Allow Trust (revoke)",
    query: `?type=allowTrust&trustor=${pubkey}&assetCode=${assetCode}&authorize=0`
  },
  {
    name: "Allow Trust (authorize)",
    query: `?type=allowTrust&trustor=${pubkey}&assetCode=${assetCode}&authorize=1`
  },
  {
    name: "Allow Trust (liability)",
    query: `?type=allowTrust&trustor=${pubkey}&assetCode=${assetCode}&authorize=2`
  },

  {
    name: "Allow Trust (revoke, backward compatibility)",
    query: `?type=allowTrust&trustor=${pubkey}&assetCode=${assetCode}&authorize=false`,
    queryConverted: `?type=allowTrust&trustor=${pubkey}&assetCode=${assetCode}&authorize=0`
  },
  {
    name: "Allow Trust (authorize, backward compatibility)",
    query: `?type=allowTrust&trustor=${pubkey}&assetCode=${assetCode}&authorize=true`,
    queryConverted: `?type=allowTrust&trustor=${pubkey}&assetCode=${assetCode}&authorize=1`
  },

  /* Bump Sequence */
  {
    name: "Bump Sequence",
    query: `?type=bumpSequence&bumpTo=${number}`
  },

  /* Change Trust */
  {
    name: "Change Trust (max limit)",
    query: `?type=changeTrust&asset=${asset}&limit=922337203685.4775807`,
    queryConverted: `?type=changeTrust&asset=${asset}`
  },
  {
    name: "Change Trust (max limit, syntactic sugar)",
    query: `?type=changeTrust&asset=${asset}`
  },
  {
    name: "Change Trust (arbitrary limit)",
    query: `?type=changeTrust&asset=${asset}&limit=${amount}`
  },
  {
    name: "Change Trust (removal)",
    query: `?type=changeTrust&asset=${asset}&limit=0`
  },

  /* Create Account */
  {
    name: "Create Account",
    query: `?type=createAccount&destination=${pubkey}&startingBalance=${amount}`
  },

  /* Create Passive Offer */
  {
    name: "Create Offer (backward compatibility)",
    query: `?type=createPassiveOffer&buying=${asset4}&amount=${amount}&selling=${asset12}&price=${price}`,
    queryConverted: `?type=createPassiveSellOffer&buying=${asset4}&amount=${amount}&selling=${asset12}&price=${price}`
  },
  {
    name: "Create Passive Sell Offer",
    query: `?type=createPassiveSellOffer&buying=${asset4}&amount=${amount}&selling=${asset12}&price=${price}`
  },
  {
    name: "Create Passive Sell Offer (syntactic sugar)",
    query: `?type=createPassiveSellOffer&buying=${asset}&amount=${amount}&price=${price}`
  },

  /* Manage Data */
  {
    name: "Manage Data (set)",
    query: `?type=manageData&name=${name}&value=${text}`
  },
  {
    name: "Manage Data (set, binary)",
    query: `?type=manageData&name=${name}&value=base64:${base64}`
  },
  {
    name: "Manage Data (set, binary/NULL)",
    query: `?type=manageData&name=${name}&value=base64:${base64WithNull}`
  },
  {
    name: "Manage Data (unset)",
    query: `?type=manageData&name=${name}&value=`
  },

  /* Manage Buy Offer */
  {
    name: "Manage Buy Offer (create)",
    query: `?type=manageBuyOffer&buying=${asset4}&buyAmount=${amount}&selling=${asset12}&price=${price}`
  },
  {
    name: "Manage Buy Offer (create, syntactic sugar)",
    query: `?type=manageBuyOffer&buying=${asset}&buyAmount=${amount}&price=${price}`
  },
  {
    name: "Manage Buy Offer (edit)",
    query: `?type=manageBuyOffer&buying=${asset4}&buyAmount=${amount}&selling=${asset12}&price=${price}&offerId=${number}`
  },
  {
    name: "Manage Buy Offer (remove)",
    query: `?type=manageBuyOffer&buying=${asset4}&buyAmount=0&selling=${asset12}&price=1&offerId=${number}`
  },
  {
    name: "Manage Buy Offer (remove, syntactic sugar)",
    query: `?type=manageBuyOffer&buyAmount=0&offerId=${number}`,
    queryConverted: `?type=manageBuyOffer&buyAmount=0&offerId=${number}&buying=${assetNeutral}&price=1`
  },

  /* Manage Sell Offer */
  {
    name: "Manage Offer (backward compatibility)",
    query: `?type=manageOffer&buying=${asset4}&amount=${amount}&selling=${asset12}&price=${price}`,
    queryConverted: `?type=manageSellOffer&buying=${asset4}&amount=${amount}&selling=${asset12}&price=${price}`
  },
  {
    name: "Manage Sell Offer (create)",
    query: `?type=manageSellOffer&buying=${asset4}&amount=${amount}&selling=${asset12}&price=${price}`
  },
  {
    name: "Manage Sell Offer (create, syntactic sugar)",
    query: `?type=manageSellOffer&buying=${asset}&amount=${amount}&price=${price}`
  },
  {
    name: "Manage Sell Offer (edit)",
    query: `?type=manageSellOffer&buying=${asset4}&amount=${amount}&selling=${asset12}&price=${price}&offerId=${number}`
  },
  {
    name: "Manage Sell Offer (remove)",
    query: `?type=manageSellOffer&buying=${asset4}&amount=0&selling=${asset12}&price=1&offerId=${number}`
  },
  {
    name: "Manage Sell Offer (remove, syntactic sugar)",
    query: `?type=manageSellOffer&amount=0&offerId=${number}`,
    queryConverted: `?type=manageSellOffer&amount=0&offerId=${number}&buying=${assetNeutral}&price=1`
  },

  /* Path Payment Strict Receive */
  {
    name: "Path Payment (backward compatibility)",
    query: `?type=pathPayment&sendAsset=${asset4}&sendMax=${amount}&destination=${pubkey}&destAsset=${asset12}&destAmount=${amount}`,
    queryConverted: `?type=pathPaymentStrictReceive&sendAsset=${asset4}&sendMax=${amount}&destination=${pubkey}&destAsset=${asset12}&destAmount=${amount}`
  },
  {
    name: "Path Payment Strict Receive (no path)",
    query: `?type=pathPaymentStrictReceive&sendAsset=${asset4}&sendMax=${amount}&destination=${pubkey}&destAsset=${asset12}&destAmount=${amount}`
  },
  {
    name: "Path Payment Strict Receive (1 asset path)",
    query: `?type=pathPaymentStrictReceive&sendAsset=${asset}&sendMax=${amount}&destination=${pubkey}&destAmount=${amount}&path=${path1}`
  },
  {
    name: "Path Payment Strict Receive (5 asset path)",
    query: `?type=pathPaymentStrictReceive&sendAsset=${asset}&sendMax=${amount}&destination=${pubkey}&destAmount=${amount}&path=${path5}`
  },

  /* Path Payment Strict Send */
  {
    name: "Path Payment Strict Send (no path)",
    query: `?type=pathPaymentStrictSend&sendAsset=${asset4}&sendAmount=${amount}&destination=${pubkey}&destAsset=${asset12}&destMin=${amount}`
  },
  {
    name: "Path Payment Strict Send (1 asset path)",
    query: `?type=pathPaymentStrictSend&sendAsset=${asset}&sendAmount=${amount}&destination=${pubkey}&destMin=${amount}&path=${path1}`
  },
  {
    name: "Path Payment Strict Send (5 asset path)",
    query: `?type=pathPaymentStrictSend&sendAsset=${asset}&sendAmount=${amount}&destination=${pubkey}&destMin=${amount}&path=${path5}`
  },

  /* Payment */
  {
    name: "Payment (XLM)",
    query: `?type=payment&destination=${pubkey}&asset=XLM&amount=${amount}`,
    queryConverted: `?type=payment&destination=${pubkey}&amount=${amount}`
  },
  {
    name: "Payment (asset 4)",
    query: `?type=payment&destination=${pubkey}&asset=${asset4}&amount=${amount}`
  },
  {
    name: "Payment (asset 12)",
    query: `?type=payment&destination=${pubkey}&asset=${asset12}&amount=${amount}`
  },

  /* Set Options */
  {
    name: "Set Options (noop)",
    query: "?type=setOptions"
  },
  {
    name: "Set Options (custom source)",
    query: `?type=transaction&operation=setOptions&source=${pubkey}`
  },

  // Misc
  {
    name: "Set Options (set homeDomain)",
    query: `?type=setOptions&homeDomain=${domain}`
  },
  {
    name: "Set Options (unset homeDomain)",
    query: `?type=setOptions&homeDomain=`
  },

  // Flags
  {
    name: "Set Options (clear one flag)",
    query: "?type=setOptions&clearFlags=3"
  },
  {
    name: "Set Options (clear all flags)",
    query: "?type=setOptions&clearFlags=7"
  },
  {
    name: "Set Options (set one flag)",
    query: "?type=setOptions&setFlags=3"
  },
  {
    name: "Set Options (set all flags)",
    query: "?type=setOptions&setFlags=7"
  },

  // Signers
  {
    name: "Set Options (set master key weight)",
    query: `?type=setOptions&masterWeight=${weight}`
  },
  {
    name: "Set Options (revoke master key)",
    query: "?type=setOptions&masterWeight=0"
  },
  {
    name: "Set Option (set thresholds)",
    query: "?type=setOptions&lowThreshold=1&medThreshold=5&highThreshold=8"
  },
  {
    name: "Set Options (set pubkey signer)",
    query: `?type=setOptions&signer=${weight}:key:${pubkey}`
  },
  {
    name: "Set Options (unset pubkey signer)",
    query: `?type=setOptions&signer=0:key:${pubkey}`
  },
  {
    name: "Set Options (set hash signer)",
    query: `?type=setOptions&signer=${weight}:hash:${hash}`
  },
  {
    name: "Set Options (unset hash signer)",
    query: `?type=setOptions&signer=0:hash:${hash}`
  },
  {
    name: "Set Options (set tx signer)",
    query: `?type=setOptions&signer=${weight}:tx:${hash}`
  },
  {
    name: "Set Options (unset tx signer)",
    query: `?type=setOptions&signer=0:tx:${hash}`
  }
]

/* Export */
module.exports = data
