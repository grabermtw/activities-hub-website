 function boundbyten(n) {
     if (n < 0) {
         return 0;
       }
       else if (n > 10) {
         return 10;
       }
       else {
         return n;
       }
 }

module.exports = { boundbyten: boundbyten };
