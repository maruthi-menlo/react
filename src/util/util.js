
export class FsnetUtil{
    convertToCurrency(value) {
        let amount = parseFloat(value);
        
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

    getEnvelopeId() {
        var url = window.location.href;
        var parts = url.split("id=");
        var urlSplitFundId = parts[parts.length - 1];
        var envelopId = urlSplitFundId.split("?")[0]
        return envelopId;
    }

    getCurrentPageForLP() {
        var url = window.location.href;
        var parts = url.split("/");
        var page = parts[parts.length - 2];
        return page;
    }

    percentage(partialValue, totalValue) {
        return (100 * partialValue) / totalValue;
    } 

    checkNullOrEmpty(list,obj) {
        for(let index of list) {
            if(obj[index] === null || obj[index] === '' || obj[index] === undefined) {
                if(index == 'otherInvestorAttributes' && obj[index] && obj[index].length == 0) {
                    return false;
                }
                return false;
            }
        }
        return true;
    }


    decodeEntities(encodedString) {
        var textArea = document.createElement('textarea');
        textArea.innerHTML = encodedString;
        console.log('textArea.value:::',textArea.value);
        return textArea.value;
    }

    decodeObj(obj) {
        if (!Array.isArray(obj) && typeof obj != 'object') return obj;
        return Object.keys(obj).reduce((acc, key) => {
          acc[key] = obj[key] != null ? (typeof obj[key] == 'string'? this.decodeEntities(obj[key]) : this.decodeObj(obj[key])): null;
          return acc;
        }, Array.isArray(obj)? []:{});
    }
    
    

}