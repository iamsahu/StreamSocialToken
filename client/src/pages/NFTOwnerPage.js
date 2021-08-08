import React, { useEffect, useState } from 'react';
import { Flex } from '@chakra-ui/react';
import OwnerNFTs from '../components/OwnerNFTs';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function NFTOwnerPage(params) {
  let { id } = useParams();
  const [flows, setFlows] = useState([]);

  useEffect(() => {
    axios({
      url: 'https://api.thegraph.com/subgraphs/name/superfluid-finance/superfluid-mumbai',
      method: 'post',
      data: {
        query: `
      query flowsforid($id:Bytes) {
        accounts(where:{id:$id}) {
          flowsReceived {
            id
            flowRate
            sum
            token {
              id
              name
              symbol
            }
            owner {
              id
            }
          }
        }
      }
      `,
        variables: {
          id: id,
        },
      },
    }).then(result => {
      console.log(result.data);
      setFlows(result.data.data.accounts[0]['flowsReceived']);
    });
  }, []);

  return (
    <Flex direction="column" width="full" height="full" alignItems="center">
      <Flex
        height="72"
        width="full"
        bgGradient="linear(to-r,gray.300,yellow.400,pink.200)"
        direction="row"
      >
        {flows.map(flow => {
          return (
            <div key={flow['id']}>
              Currently receiving {flow['token']['name']} at the rate of{' '}
              {flow['flowRate']}/sec
            </div>
          );
        })}
      </Flex>
      <Flex width="full" justifyContent="center">
        <OwnerNFTs />
      </Flex>
    </Flex>
  );
}

export default NFTOwnerPage;
