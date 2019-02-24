import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { select_products } from '../actions';

class CarouselBro extends Component {
    onCarouselClick = (index) => {
        this.props.select_products(this.props.listProducts[index]);
    }
    render() {
        if(this.props.selectedProducts.id === 0) {
            return (
                <Carousel autoPlay showThumbs={false} infiniteLoop={true}>
                    <div onClick={() => this.onCarouselClick(2)}>
                    <img src="http://localhost:1988/img/products/PRD1550998932116.jpg" 
                    alt="Business Model Canvas 101" width={300} height={280} className="img-responsive" />
                    </div>
                    <div onClick={() => this.onCarouselClick(1)}>
                    <img src="https://scontent-sin2-1.xx.fbcdn.net/v/t1.0-9/45886663_996253347225919_1047524579121037312_n.jpg?_nc_cat=103&_nc_ht=scontent-sin2-1.xx&oh=b00b9509d522cb6b2d5f615cfa8a914e&oe=5CE4FA1B" 
                    alt="UX Design 101: Wireframing and Prototyping" width={300} height={280} className="img-responsive" />
                    </div>
                    <div onClick={() => this.onCarouselClick(0)}>
                    <img src="https://scontent-sin2-1.xx.fbcdn.net/v/t1.0-9/41162359_962545377263383_2473891580423962624_n.jpg?_nc_cat=103&_nc_ht=scontent-sin2-1.xx&oh=54276150d7eb0e431f757d8b47380330&oe=5CEC4074" 
                    alt="Leveraging Brand Engagement Using Social Media" width={300} height={280} className="img-responsive" />
                    </div>
                </Carousel>
            )
        }
        return <Redirect to={`/productsdetails?id=${this.props.selectedProducts.id}`} />;
    }
}

const mapStateToProps = (state) => {
    const selectedProducts = state.selectedProducts;

    return { selectedProducts };
}

export default connect(mapStateToProps, { select_products })(CarouselBro);
