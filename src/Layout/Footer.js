import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="bg-gray-800 py-4">
        <p className="text-center text-gray-400 text-sm" onClick={() => navigate("/TermsAndPrivacy")}>
          &copy; {new Date().getFullYear()} Degen Games. All rights reserved.
          <br />
          <span className="text-gray-500 cursor-pointer hover:text-gray-300">
            Terms of Use & Privacy Policy
          </span>
          <br/>
          <span className="text-center text-gray-600 text-xs">
            Experimental Platform - Use at Your Own Risk
          </span>
        </p>
      </div>
    </div>
  );
};


export default Footer;
