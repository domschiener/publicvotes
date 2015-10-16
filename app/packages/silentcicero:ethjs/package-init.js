// Browser environment
if(typeof window !== 'undefined') {
    Accounts = (typeof window.Accounts !== 'undefined') ? window.Accounts : require('ethereumjs-accounts');
}


// Node environment
if(typeof global !== 'undefined') {
    Accounts = (typeof global.Accounts !== 'undefined') ? global.Accounts : require('ethereumjs-accounts');
}