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
                    <div onClick={() => this.onCarouselClick(8)}>
                    <img src="https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F54083434%2F150602629173%2F1%2Foriginal.20181218-104436?w=1000&auto=compress&rect=0%2C0%2C3750%2C1875&s=68595d09e897b11c10ddd57bb52bf153" 
                    alt="Business Model Canvas 101" width={800} height={280} className="img-responsive" />
                    </div>
                    <div onClick={() => this.onCarouselClick(7)}>
                    <img src="https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F53952624%2F150602629173%2F1%2Foriginal.20181214-065230?w=800&auto=compress&rect=0%2C0%2C3750%2C1875&s=5859aa1b5e58f776883fbaa2ee7fb61e" 
                    alt="UX Design 101: Wireframing and Prototyping" width={800} height={280} className="img-responsive" />
                    </div>
                    <div onClick={() => this.onCarouselClick(6)}>
                    <img src="https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F54236489%2F150602629173%2F1%2Foriginal.20181221-083910?w=800&auto=compress&rect=0%2C0%2C3750%2C1875&s=ee85148c02d2ec19c8b1f4ebe27f77bb" 
                    alt="Leveraging Brand Engagement Using Social Media" width={800} height={280} className="img-responsive" />
                    </div>
                    <div onClick={() => this.onCarouselClick(5)}>
                    <img src="https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F53805430%2F150602629173%2F1%2Foriginal.20181211-064000?w=800&auto=compress&rect=0%2C0%2C3750%2C1875&s=d25760566bd58d63293e217c9c20d5da" 
                    alt="Social Media Planning & Development" width={800} height={280} className="img-responsive" />
                    </div>
                    <div onClick={() => this.onCarouselClick(4)}>
                    <img src="https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F53675121%2F150602629173%2F1%2Foriginal.20181207-040236?w=800&auto=compress&rect=0%2C0%2C3750%2C1875&s=e71120aa081ba1b98f626d67f265d00e" 
                    alt="Product Management Bootcamp" width={800} height={280} className="img-responsive" />
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
