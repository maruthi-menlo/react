
export class FsnetUtil{

    convertToCurrency(value) {
        let amount = value;
        if(amount !== '') {
            // Create our number formatter.
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                // the default value for minimumFractionDigits depends on the currency
                // and is usually already 2
            });
            return formatter.format(amount); 
        }
    }

    convertNumberToMillion(labelValue) {
        // Nine Zeroes for Billions
        return Math.abs(Number(labelValue)) >= 1.0e+9
    
        ? Math.abs(Number(labelValue)) / 1.0e+9 + "B"
        // Six Zeroes for Millions 
        : Math.abs(Number(labelValue)) >= 1.0e+6
    
        ? Math.abs(Number(labelValue)) / 1.0e+6 + "M"
        // Three Zeroes for Thousands
        : Math.abs(Number(labelValue)) >= 1.0e+3
    
        ? Math.abs(Number(labelValue)) / 1.0e+3 + "K"
    
        : Math.abs(Number(labelValue));
    }

    getLpFundId() {
        var url = window.location.href;
        var parts = url.split("/");
        var urlSplitFundId = parts[parts.length - 1];
        return urlSplitFundId;
    }

    getCurrentPageForLP() {
        var url = window.location.href;
        var parts = url.split("/");
        var page = parts[parts.length - 2];
        return page;
    }

    checkNullOrEmpty(list,obj) {
        for(let index of list) {
            if(obj[index] === null || obj[index] === '' || obj[index] === undefined) {
                return false;
            }
        }
        return true;
    }
    
    

}