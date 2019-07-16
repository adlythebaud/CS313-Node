'use strict'
const e = React.createElement;

class searchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: "",
            results: []
        }
        
    }
    // TODO:
    /**
     * Get query from UI
     * Send parameter to index.js to run query.
     */
    

    handleFormSubmit = (e) => {
        e.preventDefault();
        console.log(this.state.query);

        // save the results array in a temporary variable
        var tempArray = this.state.results;

        // add the query results to it
        tempArray.push(this.state.query);

        // set state to temporary array
        this.setState({results: tempArray});
        
        
    }

    render() {

        const formSubmitButton = (
            <button onClick={e => this.handleFormSubmit(e)}>Submit</button>
        );


        let results = (
            this.state.results.map((result) => 
                <div>
                    {result}
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
                {results}
            </div>
        );
    }
}

const domContainer = document.querySelector('#container');
ReactDOM.render(e(searchBar), domContainer);