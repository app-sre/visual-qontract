import React from 'react';
import Definition from '../../components/Definition';
import Roles from './Roles';



function User({ user }) {
  var key;
  if(user.public_gpg_key == null){
    key = "-";
  }
  else if (user.public_gpg_key.length>= 50) {
     key = user.public_gpg_key.substring(0,50) + '...';
  }
  else {
     key = user.public_gpg_key;
  }
  //taken from: https://stackoverflow.com/questions/44656610/download-a-string-as-txt-file-in-react
  function downloadKey(e) {
    e.preventDefault();
    const element = document.createElement("a");
    const file = new Blob([user.public_gpg_key], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${user.redhat_username}_public_gpg_key.txt`;
    document.body.appendChild(element); 
    element.click();
  }
  return (
    <React.Fragment>
      <h4>Info</h4>
      <Definition
        items={[
          ['Name', user.name],
          ['Path', <a href={`${window.DATA_DIR_URL}${user.path}`}>{user.path}</a>],
          [
            'Red Hat Username',
            <a href={`https://mojo.redhat.com/people/${user.redhat_username}`}>{user.redhat_username}</a>
          ],
          ['GitHub Username', <a href={`https://github.com/${user.github_username}`}>{user.github_username}</a>],
          [
            'Quay Username',
            (user.quay_username && <a href={`https://quay.io/user/${user.quay_username}`}>{user.quay_username}</a>) ||
              '-'
          ],
          [ 
            'Public gpg Key',   <button onClick={downloadKey}> {key} </button> 
          ]
        ]}
      />
      <h4>Roles</h4>
      console.log(key);
      <Roles roles={user.roles} />
    </React.Fragment>
  );
}

export default User;
