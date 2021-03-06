/* eslint-disable */

import {
  getAllInternalTransactions,
  InternalTransactions,
} from '../../../api/etherscan/accounts';
import { wait } from '../../../utils/wait';

export const fetchAllInternalTransactions = async ({
  address,
}: {
  address: string;
}) => {
  // Note: we fetch the complete history to calculate the assets afterwards
  const startBlock = 0;
  const endBlock = 99999999;
  const batchSize = 1000;
  let isFetching = true;
  let fetchesBeforeTimeout = 0;
  let page = 1;
  let transactions: InternalTransactions = [];

  while (isFetching) {
    const newTransactions = await getAllInternalTransactions(
      address,
      startBlock,
      endBlock,
      page,
      batchSize,
    );
    transactions = [...transactions, ...newTransactions];
    fetchesBeforeTimeout += 1;
    page += 1;
    if (newTransactions.length !== batchSize || page === 10) {
      isFetching = false;
      break;
    }
    if (fetchesBeforeTimeout === 5) {
      fetchesBeforeTimeout = 0;
      await wait(1000);
    }
  }

  return transactions;
};
