import {
  extension
} from "@shopify/ui-extensions/checkout";

export default extension('purchase.checkout.delivery-address.render-before', (root, {buyerJourney, shippingAddress, settings})=>{


    buyerJourney.intercept(
      ({canBlockProgress}) => {


        let error_object = {
          behavior:"block",
          reason:"Address error",
          errors:[
            {
              message:settings.current.addresses_lines_error,
              target:"$.cart.deliveryGroups[0].deliveryAddress."
            }
          ]
        }


 

        let po_box_regex = settings.current.addresses_lines_regexps.split(/[\s\n]+/);



        po_box_regex = po_box_regex.filter(item=>{
          return item.trim().length
        })




        po_box_regex = po_box_regex.map(item=>{
          item = item.trim().split('/');
          let flag = item.pop();
          item = item.join('/');

          item = item.replace("\\\\", "\\");

          item = item.startsWith('/') ? item.substring(1) : item;
          item = item.endsWith('/') ? item.slice(0, -1) : item;

          return new RegExp(item, flag);
        })
        

        // let po_box_regex = /\b(?:p\.?\s*o\.?|post\s+office)(\s+)?(?:box|[0-9]*)?\b/igm;


        let address = shippingAddress?.current;
        console.log(address);

        //Run throught address fields
        if(['address1', 'address2', 'city'].some(item=>{
          if(po_box_regex.some(rgx=>{
            return rgx.test(address[item])
          })){
            error_object.errors[0].target+=item;
            return true;
          }

        })){
          //throw errors
          return error_object;
        }


        //Check states
        if(['AA','AE','AP'].includes(address.provinceCode)){
          error_object.errors[0].target+='provinceCode';
          return error_object;
        }


        //Check ZIP Code
        let postal_code_num = Number(address.zip) 
        if(address.zip.startsWith('09') || address.zip.startsWith('340') || (postal_code_num >= 96200 && postal_code_num < 96700)){
          error_object.errors[0].target+='zip';
          return error_object;          
        }



        return {
          behavior: "allow"
        };

    })


});
