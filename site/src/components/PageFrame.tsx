import './PageFrame.css';

export default function PageFrame() {
  return (
    <div className="page-frame" aria-hidden="true">
      <span className="page-frame-corner tl" />
      <span className="page-frame-corner tr" />
      <span className="page-frame-corner bl" />
      <span className="page-frame-corner br" />
    </div>
  );
}
