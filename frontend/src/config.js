function Config(){
    switch(process.env.NODE_ENV){
        case 'development':
            return {
             	server: 'http://13.124.10.165'
            };

        case 'production':
            return {
            	server: 'http://13.124.10.165'
            };

        default:
            return {};
    }
};

export default Config;