function Config(){
    switch(process.env.NODE_ENV){
        case 'development':
            return {
             	server: 'http://127.0.0.1:5000'
            };

        case 'production':
            return {
            	server: 'https://kanmeiju.herokuapp.com'
            };

        default:
            return {};
    }
};

export default Config;