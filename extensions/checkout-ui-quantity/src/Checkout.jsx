import {useEffect, useState} from 'react';
import {
  useApi,
  reactExtension,
  useCartLines,
  useApplyCartLinesChange  
} from '@shopify/ui-extensions-react/checkout';
export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);
function Extension() {

  return false;

  const lines = useCartLines();
  const applyCartLinesChange = useApplyCartLinesChange();


  const [data, setData] = useState();
  const {query} = useApi();

  useEffect(() => {



    lines.forEach(item=>{


      query(
        `query GetProductsById($id: ID!) {
          product(id: $id) {
            title
            tags
          }
        }`,
        {
          variables: {id: item.merchandise.product.id},
        },
      )
      .then(({data, errors}) => {
        console.log(data);
        async () => {
          await applyCartLinesChange({
            type: 'updateCartLine',
            id: item.id,
            quantity: 1,
          })
        }
      })
    })

















  }, [query]);

  return true;
}