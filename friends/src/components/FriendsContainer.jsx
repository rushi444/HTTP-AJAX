import React, { Component } from 'react';
import { withRouter, Route, NavLink } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import FriendsList from './FriendsList';
import NewFriendForm from './NewFriendForm'; 

const url = 'http://localhost:5000/friends';
const StyledNavLinks = styled(NavLink)`
  padding: 1rem 2rem;
  margin: .5rem;
  display: inline-block;
  text-decoration: none;
  color: white;
  background: rgb(161,21,29);
`;

class FriendsContainer extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      friends: [],
      isLoading: false,
    }
  }

  fetchFriends = () => {
    this.setState({ isLoading: true })
    axios.get(url)
      .then(response => {
        this.setState({
          friends: response.data,
        })
      })
      .catch(error => {
        error.response && console.error(error.response.statusText)
      })
      .finally(()=> this.setState({isLoading: false}))
  }

  addNewFriend = ({name, age, email}) => {
    this.setState({ isLoading: true })
    const newFriend = {
      name,
      age,
      email,
    };
    axios.post(url, newFriend)
      .then(() => {
        this.fetchFriends()
        this.props.history.push('/friends')
      })
  }

  updateFriend = ({name, age, email}, id) => {
    this.setState({ isLoading: true })
    const friendToUpdate = {
      name,
      age,
      email,
    };
    axios.put(`${url}/${id}`, friendToUpdate)
      .then(() => {
        this.fetchFriends()
        this.props.history.push('/friends')
      })
  }

  deleteFriend = (id) => {
    axios.delete(`${url}/${id}`)
      .then(() => {
        this.fetchFriends()
        this.props.history.push('/friends')
      })
  }

  fetchOneFriend = () => {
    
  }

  componentDidMount() {
    this.fetchFriends();
  }

  render() {
    const { friends, isLoading } = this.state;
    return (
      <div>
        <StyledNavLinks to='/friends'>Friends</StyledNavLinks>
        <StyledNavLinks to='/add-friend'>Add New Friend</StyledNavLinks>

        <Route
          exact
          path={['/','/friends']}
          render={(props) => 
            <FriendsList {...props} 
              friends={friends} 
              isLoading={isLoading}
              deleteFriend={this.deleteFriend}
            />
          }
        />
        <Route
          exact
          path='/add-friend'
          render={(props) => 
            <NewFriendForm {...props} 
              isLoading={isLoading}
              addNewFriend={this.addNewFriend}
            />
          }
        />
        <Route
          exact
          path='/friends/:id'
          render={(props) => 
            <NewFriendForm {...props} 
              isLoading={isLoading}
              friends={friends}
              addNewFriend={this.addNewFriend}
              updateFriend={this.updateFriend}
            />
          }
        />
      </div>
    )
  }
}

export default withRouter(FriendsContainer)