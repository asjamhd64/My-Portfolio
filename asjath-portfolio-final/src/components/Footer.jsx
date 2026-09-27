import SocialLinks from './SocialLinks'

export default function Footer() {
  return (
    <footer>
      <div className="f-left">© 2026 ASJATH — All Rights Reserved.</div>
      <div className="f-right">
        <SocialLinks variant="footer" />
        <a href="#hero">Back to top</a>
      </div>
    </footer>
  )
}
