import './styles/err.css';

export default function Err() {

  return (
    <div className='e1'>
      <div className='e'>
        <div className="badge">
          <span className="badge-dot"></span>
          <span>Oops! Lost in the campus</span>
        </div>

        <div className="code">404</div>
        <h1 className="title">Page Not Found</h1>

        <p className="message">
          The page you are looking for doesn't exist, was moved, or never enrolled this semester.<br></br>
          Let's get you back to a familiar hallway.
        </p>

        <div className="actions">
          
          <a href="/" className="btn btn-primary">Back to Home</a>
          <a href="/browse" className="btn btn-ghost">Browse Items</a>
        </div>

        <p className="hint">
          Error code: <strong>SRM-404</strong> • If this keeps happening, contact support.
        </p>
      </div>
    </div>

)}
