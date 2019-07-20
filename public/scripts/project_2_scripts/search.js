const e = React.createElement;

class searchBar extends React.Component {
    constructor(props) {
        super(props);   
        this.saveResultInState = this.saveResultInState.bind(this);
        this.saveRestaurantsFromDBInState = this.saveRestaurantsFromDBInState.bind(this);
        this.saveRestaurantsToEditInState = this.saveRestaurantsToEditInState.bind(this);
        this.saveMenuItem = this.saveMenuItem.bind(this);        
        this.editMenu = this.editMenu.bind(this);
        this.editRestaurant = this.editRestaurant.bind(this);
        this.deleteRestaurant = this.deleteRestaurant.bind(this);

        this.state = {
            query: "",
            results: [],
            saved_restaurants: [],
            restaurants_to_edit: [],
            menu_item_name: "",
            menu_item_health_score: 0,
            addMenuItemInputs: false,
            editRestaurant: false,
            restaurant_name: "",
            restaurant_address: "",
            search: false, 
            editedRestaurantName: "", 
            editedRestaurantAddress: ""
        }     
    }

    clearState = () => {
        this.state.results = [];
        this.state.saved_restaurants = [];
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

    // TODO: Edit this to work like above functions
    saveRestaurantsToEditInState = (state, response) => {
        // save the results array in a temporary variable
        var tempArray = state.restaurants_to_edit;

        // add the query results to it
        tempArray.push(response);

        // set state to temporary array
        this.setState({
            restaurants_to_edit: tempArray
        });    
    }

    getRestaurants = (e) => {        
        e.preventDefault();
        this.clearState();
        this.state.search = true;
        if (this.state.query) {
            axios.get('/restaurants', {
                    params: {
                        input: this.state.query
                    }
                })
                .then((response) => {                    
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
                    // TODO: Notify to user that the record was correctly added.
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    getAllRestaurants = (e) => {
        e.preventDefault();
        this.clearState();
        this.state.search = false;

        axios.get('/restaurants')
        .then((response) => {            
            this.saveRestaurantsFromDBInState(this.state, response.data);                
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    saveMenuItem = (e, restaurant) => {
        e.preventDefault();
        if (this.state.menu_item_name && restaurant.place_id && this.state.menu_item_health_score)
        {
            axios.post('/menu_item', {
                name: this.state.menu_item_name,
                place_id: restaurant.place_id,            
                health_score: this.state.menu_item_health_score
            })
            .then((response) => {
                // TODO: Notify to user that the record was correctly added.
            })
            .catch((error) => {
                console.log(error);
            });
        }                        
    }

    editMenu = (e) => {
        e.preventDefault();
    }
    editRestaurant = (e, restaurant) => {
        e.preventDefault();
        this.saveRestaurantsToEditInState(this.state, restaurant);
        // parse result        
        restaurant = JSON.parse(restaurant);        
        this.setState({editRestaurant: true, editedRestaurantName: restaurant.name, editedRestaurantAddress: restaurant.formatted_address});        
    }
    deleteRestaurant = (e, restaurant) => {
        e.preventDefault();        
        console.log("restaurant deleted by user");

        // clear state
        this.setState({editRestaurant: false, editedRestaurantName: "", editedRestaurantAddress: "", restaurants_to_edit: []});
    }

    putRestaurant = (e) => {
        e.preventDefault();        
        console.log("new restaurant values are: " + this.state.editedRestaurantName + ", " + this.state.editedRestaurantAddress);
        console.log("restaurant edited and saved by user");

        // clear state
        this.setState({editRestaurant: false, editedRestaurantName: "", editedRestaurantAddress: "", restaurants_to_edit: []});
    }

    cancelEditRestaurant = (e) => {
        e.preventDefault();        
        console.log("restaurant editing cancelled by user");

        // clear state
        this.setState({editRestaurant: false, editedRestaurantName: "", editedRestaurantAddress: "", restaurants_to_edit: []});
    }

    render() {        
        const formSubmitButton = (
            <button onClick={e => this.getRestaurants(e)}>Search</button>
        );
    
        const getAllRestaurantsButton = (
            <button onClick={e => this.getAllRestaurants(e)}>View Saved Restaurants</button>
        );

        let searchResultsUI = (
            this.state.results.map((result) => 
                <div>                                    
                    <strong>Name: </strong>{JSON.parse(result).name}<br></br>
                    <strong>Address: </strong>{JSON.parse(result).formatted_address}<br></br>
                    <strong>Place ID: </strong>{JSON.parse(result).place_id}<br></br>
                    <button onClick={e => this.addRestaurantToDatabase(e, JSON.parse(result))}>Save Restaurant</button>
                    <br></br>
                </div>
            )
        );

        // modify this one.
        let savedResultsUI = (
            this.state.saved_restaurants.map((result) => 
                <div>                
                    <strong>Name: </strong>{JSON.parse(result).name}<br></br>
                    <strong>Address: </strong>{JSON.parse(result).formatted_address}<br></br>
                    <strong>Place ID: </strong>{JSON.parse(result).place_id}<br></br>
                    {/* in the editRestaurant button, set a flag for the specific restaurant id that it wants to be edited. */}
                    <button onClick={e => this.editRestaurant(e, result)}>Edit Restaurant</button>
                    <button onClick={e => this.deleteRestaurant(e, JSON.parse(result))}>Remove Restaurant</button>
                    <br></br>
                </div>
            )
        );

        let editRestaurantUI = (
            // instead of this.state.saved_restaurants, map against this.state.restaurants_to_edit
            this.state.restaurants_to_edit.map((result) => 
                <div>                
                    <strong>Name: </strong><input type="text" className="form-control" placeholder={JSON.parse(result).name} onChange={e => this.setState({editedRestaurantName: e.target.value})}></input><br></br>
                    <strong>Address: </strong><input type="text" className="form-control" placeholder={JSON.parse(result).formatted_address} onChange={e => this.setState({editedRestaurantAddress: e.target.value})}></input><br></br>
                    
                    <button onClick={e => this.putRestaurant(e)}>Save</button>
                    <button onClick={e => this.cancelEditRestaurant(e)}>Cancel</button>
                    <br></br>
                </div>
            )
        );

        let restaurantsUI = this.state.editRestaurant ? (editRestaurantUI) : (savedResultsUI);

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
                {searchResultsUI}
                {restaurantsUI}               
            </div>
        );
    }
}

const domContainer = document.querySelector('#container');
ReactDOM.render(e(searchBar), domContainer);