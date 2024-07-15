// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {


  // let data = input.cart.lines;
  let errors_object = {
    "errors":[]
  }



  let gwp_tiers = {};



  input.cart.lines.forEach(line =>{  

    if(line.quantity > 1){
      
    

      line.merchandise.product.hasTags.forEach(tag=>{
        if(tag.tag == 'FreeGift' && tag.hasTag ){
          errors_object.errors.push({
              localizedMessage: "The max quantity of Free Gift product is 1",
              target: "cart",        
          })
        }

        if(tag.tag == 'Sample' && tag.hasTag){
          errors_object.errors.push({
              localizedMessage: "The max quantity of Sample product is 1",
              target: "cart",        
          });    
        }
      });


      let product_type = line.merchandise.product.productType.toLowerCase();
      if(product_type == 'sample' || product_type == 'freegift'){
        errors_object.errors.push({
            localizedMessage: "The max quantity of Free Gift or Sample product is 1",
            target: "cart",        
        });       
      }


      if(line.cost.totalAmount.amount == 0){
        errors_object.errors.push({
            localizedMessage: "The max quantity of product with zero price is 1",
            target: "cart",        
        });       
      }



    }







    
    let gwp_threshold = Number(line.merchandise.product.gwp_threshold?.value);
    

    if(gwp_threshold){
      //it's a GWP product
      let cart_total = Number(input.cart.cost.totalAmount.amount);


      //Threshold Check
      if(gwp_threshold > cart_total){
        errors_object.errors.push({
           localizedMessage: "Your cart doesn't fit GWP threshold conditions",
            target: "cart",        
        });        
      }





      
      //Tier Max Item Amount Check
      let gwp_tier_name = line.merchandise.product.gwp_tier?.value;
      let gwp_tier_max_amount = Number(line.merchandise.product.gwp_tier_amount?.value);





      if(gwp_tier_name && gwp_tier_max_amount){


        if(gwp_tiers[gwp_tier_name]){
          gwp_tiers[gwp_tier_name] += line.quantity;
        }
        else{
          gwp_tiers[gwp_tier_name] = line.quantity;        
        }

        if(gwp_tiers[gwp_tier_name] > gwp_tier_max_amount){
          errors_object.errors.push({
            localizedMessage: "Your cart doesn't fit GWP max amount conditions",
            target: "cart",        
          });           
        }


      }
      
    }
    
  })






  return errors_object;


};