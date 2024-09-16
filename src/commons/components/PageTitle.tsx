
import { Helmet } from 'react-helmet'

interface IPageTitleProps {
    title: string,
}

const PageTitle:React.FC<IPageTitleProps> = ({title}) => {
  return (
     
   
     <Helmet>
                <meta charSet="utf-8" />
               <title>{title }</title>
                <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>
        
  )
}

export default PageTitle