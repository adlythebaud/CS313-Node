const e = React.createElement;

class searchBar extends React.Component {
    constructor(props) {
        super(props);   
        this.saveResultInState = this.saveResultInState.bind(this);
        this.saveRestaurantsFromDBInState = this.saveRestaurantsFromDBInState.bind(this);
        this.state = {
            query: "",
            results: [],
            saved_restaurants: []
        }     
    }
    
    saveResultInState = (state, response) => {
       
        for (let i = 0; i < response.length; i++) {

            // save the results array in a temporary variable
            var tempArray = state.results;

            // add the query results to it
            tempArray.push(JSON.stringify(response[i]));

            // set state to temporary array
            this.setState({
                results: tempArray
            });
        }        
    }

    saveRestaurantsFromDBInState = (state, response) => {
       
        for (let i = 0; i < response.length; i++) {

            // save the results array in a temporary variable
            var tempArray = state.saved_restaurants;

            // add the query results to it
            tempArray.push(JSON.stringify(response[i]));

            // set state to temporary array
            this.setState({
                saved_restaurants: tempArray
            });
        }        
    }

    getRestaurants = (e) => {
        e.preventDefault();

        if (this.state.query) {
            axios.get('/restaurants', {
                    params: {
                        input: this.state.query
                    }
                })
                .then((response) => {
                    console.log(response.data);
                    this.saveResultInState(this.state, response.data);                
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    addRestaurantToDatabase = (e, restaurant) => {
        e.preventDefault();
        if (this.state.results) {
            axios.post('/restaurants', {
                    //TODO: Insert all the stuff for your DB here
                    place_id: restaurant.place_id,
                    name: restaurant.name,
                    formatted_address: restaurant.formatted_address                
                })
                .then((response) => {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    getAllRestaurants = (e) => {
        e.preventDefault();
        
        axios.get('/restaurants')
        .then((response) => {
            console.log(response.data);
            this.saveRestaurantsFromDBInState(this.state, response.data);                
        })
        .catch(function (error) {
            console.log(error);
        });
    } 

    render() {
        const formSubmitButton = (
            <button onClick={e => this.getRestaurants(e)}>Search</button>
        );

        const addToDatabaseButton = (
            <button onClick={e => this.addRestaurantToDatabase(e)}>Save Restaurant</button>
        );

        const getAllRestaurantsButton = (
            <button onClick={e => this.getAllRestaurants(e)}>View Saved Restaurants</button>
        );

        let searchResults = (
            this.state.results.map((result) => 
                <div>                
                    <strong>Name: </strong>{JSON.parse(result).name}<br></br>
                    <strong>Address: </strong>{JSON.parse(result).formatted_address}<br></br>
                    <strong>Place ID: </strong>{JSON.parse(result).place_id}<br></br>
                    <button onClick={e => this.addToDatabase(e, JSON.parse(result))}>Save Restaurant</button>
                    <br></br>
                </div>
            )
        );

        let dbResults = (
            this.state.saved_restaurants.map((result) => 
                <div>                
                    <strong>Name: </strong>{JSON.parse(result).name}<br></br>
                    <strong>Address: </strong>{JSON.parse(result).formatted_address}<br></br>
                    <strong>Place ID: </strong>{JSON.parse(result).place_id}<br></br>
                    <button onClick={e => this.addToDatabase(e, JSON.parse(result))}>Save Restaurant</button>
                    <br></br>
                </div>
            )
        );

        const searchBar = (
            <div>
                <input type="text" name="place" className="form-control" placeholder="Search for a place or Restaurant" onChange={e => this.setState({query: e.target.value})}></input>
            </div>
        );

        return (
            <div className="col-md-4">
                {searchBar}
                {formSubmitButton}
                {getAllRestaurantsButton}
                {searchResults}
                {dbResults}
            </div>
        );
    }
}

const domContainer = document.querySelector('#container');
ReactDOM.render(e(searchBar), domContainer);