import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'relay-runtime';
import * as React from 'react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '~/components/ui/select';
import { Label } from '~/components/ui/label';
import type { receiverAccountSelectQuery } from '~/__generated__/receiverAccountSelectQuery.graphql';

const receiverAccountSelectQuery = graphql`
  query receiverAccountSelectQuery {
    accounts {
      edges {
        node {
          id
          _id
          accountName
        }
      }
    }
  }
`;

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
};

export function ReceiverAccountSelect({
  value,
  onChange,
  disabled,
  label = 'Receiver Account',
  placeholder = 'Select an account',
}: Props) {
  const data = useLazyLoadQuery<receiverAccountSelectQuery>(
    receiverAccountSelectQuery,
    {},
    { fetchPolicy: 'store-and-network' }
  );
  const accounts =
    data?.accounts?.edges?.map((edge) => edge?.node).filter((acc) => !!acc) ??
    [];

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {accounts.length === 0 ? (
          <SelectItem value="" disabled>
            No users found
          </SelectItem>
        ) : (
          accounts.map((account) => (
            <SelectItem key={account.id} value={account._id}>
              {account.accountName ?? account.id}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
