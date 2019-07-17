const e = React.createElement;

class searchResult extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="col-md-3">
                <h1>{this.props.name}</h1><br></br>
                <h3>{this.props.address}</h3><br></br>
                <h3>{this.props.place_id}</h3>
            </div>
        );
    }
}

export default searchResult;