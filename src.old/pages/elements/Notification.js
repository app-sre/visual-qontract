import React from 'react';
import { Link } from 'react-router-dom';
import Definition from '../../components/Definition';

function Notification({ notification }) {
  return (
    <React.Fragment>
      <h4>Info</h4>
      <Definition
        items={[
          ['Name', notification.name],
          ['Subject', notification.subject],
          ['Label', notification.labels],
          [
            'Path',
            <a href={`${window.DATA_DIR_URL}${notification.path}`} target="_blank" rel="noopener noreferrer">
              {notification.path}
            </a>
          ],
          [
            'Related Users',
            <div>
              {notification.to.users &&
                notification.to.users.map(o => (
                  <Link
                    to={{
                      pathname: '/users',
                      hash: o.path
                    }}
                  >
                    <p>{o.name}</p>
                  </Link>
                ))}
            </div>
          ],
          [
            'Body',
            <div>
              {notification.body.split('\n').map((i, key) => (
                <div key={key}>{i}</div>
              ))}
            </div>
          ]
        ]}
      />
    </React.Fragment>
  );
}

export default Notification;
