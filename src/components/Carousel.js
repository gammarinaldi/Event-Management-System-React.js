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
            console.log(this.props.listProducts)
            return (
                <Carousel autoPlay showThumbs={false} infiniteLoop={true}>
                    <div onClick={() => this.onCarouselClick(0)}>
                    <img src="http://localhost:1988/img/products/Slide-1.png" 
                    alt="Slide 1" width={300} height={280} className="img-responsive" />
                    </div>
                    <div onClick={() => this.onCarouselClick(1)}>
                    <img src="http://localhost:1988/img/products/Slide-2.png" 
                    alt="Slide 2" width={300} height={280} className="img-responsive" />
                    </div>
                    <div onClick={() => this.onCarouselClick(2)}>
                    <img src="http://localhost:1988/img/products/Slide-3.png" 
                    alt="Slide 3" width={300} height={280} className="img-responsive" />
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
