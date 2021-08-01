import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Flex, SimpleGrid } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import NFTOwner from './NFTOwner';

const GET2 = gql`
  query subb($owner: Bytes) {
    nfts(where: { owner: $owner }) {
      owner
      creator
      id
      uri
      royalty
    }
  }
`;

function OwnerNFTs(params) {
  let { id } = useParams();
  const [dataPoints, setDataPoints] = useState([]);
  const { loading, error, data } = useQuery(GET2, {
    variables: { owner: id },
  });

  useEffect(() => {
    if (data && !error & !loading) {
      setDataPoints(data.nfts);
    }
  }, [data]);

  if (loading) {
    return <div>loading</div>;
  }
  if (error) {
    return <div>error</div>;
  }
  if (data) {
    console.log(data);
  }

  return (
    <Flex width="full" justifyContent="center">
      <SimpleGrid columns={3} spacing={10}>
        {dataPoints.map(element => (
          <NFTOwner key={element['id']} props={element} />
        ))}
      </SimpleGrid>
    </Flex>
  );
}

export default OwnerNFTs;
// Fire a query to find out if the owner has any NFTs
// If we don't find NFTs display blank
