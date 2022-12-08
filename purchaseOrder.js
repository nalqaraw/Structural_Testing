/* istanbul ignore next*/
var getAgeFactor = function(clientAccount) {

  var factor;

  if (clientAccount.age < 15 || clientAccount.age >= 95)
    factor = 0;
  else if (clientAccount.age < 25)
    factor = 10;
  else if (clientAccount.age < 35)
    factor = 15;
  else if (clientAccount.age < 55)
    factor = 50;
  else if (clientAccount.age < 65)
    factor = 40;
  else if (clientAccount.age < 95)
    factor = 25;

  return factor;

}

var getBalanceFactor = function(clientAccount) {
  var factor;


  if (clientAccount.balance <= 0 || clientAccount.balance >= 5000)
    factor = 0;
  else if (clientAccount.balance < 100)
    factor = 5;
  else if (clientAccount.balance < 500)
    factor = 15;
  else if (clientAccount.balance < 1000)
    factor = 30;
  else if (clientAccount.balance < 2000)
    factor = 50;
  else if (clientAccount.balance < 5000)
    factor = 100;
  return factor;

}

/* istanbul ignore next*/
var accountStatus = function(clientAccount) {

  var factorA = getAgeFactor(clientAccount);
  var factorB = getBalanceFactor(clientAccount);
  var factorAcc = factorA * factorB;

  if (factorAcc === 0)
    return "not-eligible";
  else if (factorAcc < 100)
    return "very-low";
  else if (factorAcc < 300)
    return "low";
  else if (factorAcc < 700)
    return "medium";
  else if (factorAcc < 1000)
    return "high";
  else
    return "excellent";

}

/* istanbul ignore next*/
var creditStatus = function(clientAccount, creditCheckMode) {
  var scoreThreshold;

  if (clientAccount.creditScore < 0 || clientAccount.creditScore > 100)
    return "not-allowed";
  if (creditCheckMode === "restricted")
    scoreThreshold = 50;
  else if (creditCheckMode === "default")
    scoreThreshold = 80;
  if (clientAccount.creditScore >= scoreThreshold)
    return "high";
  else return "low";
}

var productStatus = function(product, inventory, inventoryThreshold) {
  var quantity, i;
  for (i = 0; i < inventory.length; i++) {
    if (product === inventory[i].name) {
      quantity = inventory[i].quantity;
      if (quantity === 0)
        return "soldout";
      else if (quantity < inventoryThreshold)
        return "available-to-all";
      else return "limited"
    }
  }
  return "invalid";
}


var orderHandling = function(clientAccount, product, inventory, inventoryThreshold, creditCheckMode) {

  // var aStatus = accountStatus(clientAccount);
  // var cStatus = creditStatus(clientAccount, creditCheckMode);
  // var pStatus = productStatus(product, inventory, inventoryThreshold);

  var aStatus = module.exports.accountStatus(clientAccount);
  var cStatus = module.exports.creditStatus(clientAccount, creditCheckMode);
  var pStatus = module.exports.productStatus(product, inventory, inventoryThreshold);

  if (pStatus !== "invalid") {
	  if (((aStatus === "excellent") &&
   	   ((cStatus === "high") || (cStatus === "low")) &&
    	  ((pStatus === "available-to-all") || (pStatus === "limited"))) ||
   	 ((aStatus === "high") &&
    	  ((cStatus === "high") || (cStatus === "low")) &&
    	  (pStatus === "available-to-all")) ||
   	 ((aStatus === "high") &&
   	   (cStatus === "high") &&
    	  (pStatus === "limited")) ||
   	 ((aStatus === "medium") &&
    	  (cStatus === "high") &&
     	 (pStatus === "available-to-all")))
      return "accepted";
   	else if (
  	  ((aStatus === "excellent") && ((cStatus === "high") || (cStatus === "low")) && (pStatus === "soldout")) ||
   	 ((aStatus === "excellent") && (cStatus === "not-allowed") && ((pStatus === "available-to-all") || (pStatus === "limited"))) ||
   	 ((aStatus === "high") && (cStatus === "high") && (pStatus === "soldout")) ||
   	 ((aStatus === "high") && (cStatus === "low") && (pStatus === "limited")) ||
   	 ((aStatus === "medium") && (cStatus === "high") && (pStatus === "limited")) ||
   	 ((aStatus === "low") && (cStatus === "high") && (pStatus === "available-to-all")) ||
   	 ((aStatus === "low") && (cStatus === "high") && (pStatus === "limited")) ||
   	 ((aStatus === "very-low") && (cStatus === "high") && (pStatus === "available-to-all")))
       return "pending";
     else
       return "rejected";
	} else
    return "rejected";
}
module.exports = {orderHandling, accountStatus, creditStatus, productStatus, getAgeFactor, getBalanceFactor};