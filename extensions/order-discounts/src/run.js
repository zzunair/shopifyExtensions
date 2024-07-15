// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";
// Use JSDoc annotations for type safety
/**
* @typedef {import("../generated/api").RunInput} RunInput
* @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
* @typedef {import("../generated/api").Target} Target
* @typedef {import("../generated/api").ProductVariant} ProductVariant
*/
/**
* @type {FunctionRunResult}
*/
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};
// The configured entrypoint for the 'purchase.product-discount.run' extension target
/**
* @param {RunInput} input
* @returns {FunctionRunResult}
*/




const discount_emails_suffixs = {
  "NHS_EMAIL_SUFFIXES":{
    "discount":"30.0",
    "message":"NHS Workers' 30% discount",
    "suffixes":[
      "@nhs.net",
      ".nhs.uk",
      "@nhs.scot"
    ]
  },
  "UNILEVER_EMAIL_SUFFIXES":{
    "discount":"30.0",
    "message":"Unilever 30% discount",
    "suffixes":[
      "@unilever.com",
      "@unilever.co.uk",
      "@dermalogica.co.uk",
      "@hourglasscosmetics.co.uk",
      "@katesomerville.com",
      "@murad.com",
      "@livingproof.com",
      "@dermalogica.com",
      "@hourglasscosmetics.com",
      "@sundialbrands.com",
      "@ustudio.global",
      "@seventhgeneration.com",
      "@sirkensingtons.com",
      "@benjerry.com",
      "@schmidts.com",
      "@talentigelato.com",
      "@pukkaherbs.com",
      "@olly.com",
      "@getwelly.com ",
      "@smartypantscorp.com",
      "@liquid-iv.com ",
      "@onnit.com",
      "@onnitacademy.com",
      "@blueair.com",
      "@thelaundress.com"
    ]
  },
  "STAFF_EMAIL_SUFFIXES":{
    "discount":"50.0",
    "message":"Staff discount",
    "suffixes":[
      "renskincare.com",
      "@katesomerville.co.uk",
      "@murad.co.uk",
      "@livingproof.co.uk",
      "@tatcha.co.uk",
      "@3wavesdigital.com"      
    ]
  }


}











export function run(input) {


  let targets = [];
  

  let result_discount = false;
  let result_message = '';
  let user_email = input.cart.buyerIdentity.email;

  

  let discount_result = false;
  for(let suffixes_type in discount_emails_suffixs){
      if(discount_emails_suffixs[suffixes_type].suffixes.some(item=>{
          return user_email.endsWith(item);
      })){
          result_message = discount_emails_suffixs[suffixes_type].message;
          discount_result = discount_emails_suffixs[suffixes_type].discount;
          break;
      }
  }





  if(discount_result){

    targets = input.cart.lines
    // Only include cart lines with a quantity of two or more
    // and a targetable product variant
    .filter(line=>{

      if(line.cost.compareAtAmountPerQuantity && line.cost.compareAtAmountPerQuantity.amount > line.cost.amountPerQuantity.amount){
        return false;
      }

      if(line.merchandise.product.isGiftCard){
        return false;
      }

      if(line.merchandise.product.productType.toLowerCase() == 'gift set' || line.merchandise.product.productType.toLowerCase() == 'gift card' || line.merchandise.product.productType.toLowerCase() == 'bundles and sets'   ){
        return false;
      }

      return true;

    })
    .map(line => {
      const variant = /** @type {ProductVariant} */ (line.merchandise);

      return /** @type {Target} */ ({
        // Use the variant ID to create a discount target
        productVariant: {
          id: variant.id
        }
      });
    });

  }


  if (!discount_result) {
    // You can use STDERR for debug logs in your function
    console.error("No cart lines qualify for volume discount.");
    return EMPTY_DISCOUNT;
  }

  // The @shopify/shopify_function package applies JSON.stringify() to your function result
  // and writes it to STDOUT
  return {
    discounts: [
      {
        // Apply the discount to the collected targets
        targets,
        // Define a percentage-based discount
        value: {
          percentage: {
            value: discount_result
          }
        },
        message : result_message
      }
    ],
    discountApplicationStrategy: DiscountApplicationStrategy.Maximum
  };
};





/*
  Вопросы
  1. Как сбросить другие скидки?
  2. Как выводить сообщение о сбросе других скидок

  
  Выбирается лучшая скидка, с другими скидками не объединяется ничего


  3. Как выводить сообщение о применение скидки?


*/