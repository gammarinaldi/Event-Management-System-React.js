import React from "react";

export default () => (
    
    <div className="container">
        <div className="row justify-content-center">

            <div className="col-lg-4" style={{ marginBottom: "20px" }}>
                <div className="media">
                    <div className="media-left">
                        <a href="/">
                        <img className="media-object" src="https://i.ibb.co/swRGLfM/seo.png" 
                            width={85} height={85} alt="Feature 1" />
                        </a>
                    </div>
                    <div className="media-body">
                        <h4 className="media-heading">React.js</h4>
                        This app front-end built with React.js
                    </div>
                </div>
            </div>

            <div className="col-lg-4" style={{ marginBottom: "20px" }}>
                <div className="media">
                    <div className="media-left">
                        <a href="/">
                        <img className="media-object" src="https://i.ibb.co/pvgSHkH/digital-campaign.png" 
                            width={85} height={85} alt="Feature 2" />
                        </a>
                    </div>
                    <div className="media-body">
                        <h4 className="media-heading">Node.js</h4>
                        This app back-end built with Node.js
                    </div>
                </div>
            </div>

            <div className="col-lg-4">  
                <div className="media">
                    <div className="media-left">
                        <a href="/">
                        <img className="media-object" src="https://i.ibb.co/PTMtnm1/project.png" 
                            width={85} height={85} alt="Feature 3" />
                        </a>
                    </div>
                    <div className="media-body">
                        <h4 className="media-heading">MySQL</h4>
                        This app database built with MySQL
                    </div>
                </div>
            </div>

        </div>
    </div>
  
);
