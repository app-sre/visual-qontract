import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td
} from '@patternfly/react-table';

interface User {
  path: string;
  name: string;
  org_username?: string;
  github_username?: string;
  quay_username?: string;
  public_gpg_key?: string;
}

interface UsersTableProps {
  users: User[];
  showGpgKey?: boolean;
  showName?: boolean;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  showGpgKey = false,
  showName = true
}) => {
  const linkFormat = (url: string) => (value: string) => (
    <a href={`${url}${value}`} target="_blank" rel="noopener noreferrer">
      {value}
    </a>
  );

  return (
    <Table aria-label="Users table">
      <Thead>
        <Tr>
          {showName && <Th>Name</Th>}
          <Th>RedHat Username</Th>
          <Th>GitHub Username</Th>
          <Th>Quay Username</Th>
          {showGpgKey && <Th>Public GPG Key</Th>}
        </Tr>
      </Thead>
      <Tbody>
        {users.map((user, index) => (
          <Tr key={index}>
            {showName && (
              <Td>
                <Link
                  to={`/user${user.path}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    variant="link"
                    style={{ padding: 0, fontSize: 'inherit', fontWeight: 'bold' }}
                  >
                    {user.name}
                  </Button>
                </Link>
              </Td>
            )}
            <Td>
              {user.org_username ?
                linkFormat('https://rover.redhat.com/people/profile/')(user.org_username) :
                '-'
              }
            </Td>
            <Td>
              {user.github_username ?
                linkFormat('https://github.com/')(user.github_username) :
                '-'
              }
            </Td>
            <Td>
              {user.quay_username ?
                linkFormat('https://quay.io/user/')(user.quay_username) :
                '-'
              }
            </Td>
            {showGpgKey && (
              <Td>
                {user.public_gpg_key ? (
                  <Button
                    variant="link"
                    style={{ padding: 0, fontSize: 'inherit' }}
                  >
                    View Key
                  </Button>
                ) : (
                  '-'
                )}
              </Td>
            )}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default UsersTable;