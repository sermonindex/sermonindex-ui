export const Footer = () => {
  return (
    <footer className="flexflex-col pt-10">
      <div className="h-8 bg-si-olive border-t-2 border-si-gray"></div>
      <div className="bg-si-dark p-4">
        <div className="mx-10">
          <div className="flex flex-row justify-between py-4">
            <div className="flex flex-col text-wrap text-lg font-bold text-white">
              Everything we make is available for free because of a generous
              community of supporters.
            </div>
            <div className="flex flex-col">
              {/* todo: what does clicking this button do? */}
              <button className="bg-si-accent text-si-dark px-4 py-2 rounded-lg">
                Support SermonIndex
              </button>
            </div>
          </div>

          <hr className="my-2 border-si-olive" />
          {/* three columns for about, follow, and receive updates */}
          <div className="flex flex-row justify-between py-4">
            <div className="flex flex-col">
              <h3 className="text-si-light text-lg font-bold">About</h3>
              <ul className="text-si-light text-sm">
                {/* todo: link pages... */}
                <li>About Us</li>
                <li>Commendations</li>
                <li>Get Support</li>
                <li>Brand Guidelines</li>
                <li>Copying Permissions</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div className="flex flex-col">
              <h3 className="text-si-light text-lg font-bold">Follow</h3>
              <ul className="text-si-light text-sm">
                {/* todo: pull heroicons and add here, format as per mock-up */}
                <li>Facebook</li>
                <li>Twitter</li>
                <li>YouTube</li>
                <li>Instagram</li>
                <li>todo</li>
              </ul>
            </div>
            <div className="flex flex-col">
              <h3 className="text-si-light text-lg font-bold">
                Receive Updates
              </h3>
              <div className="text-si-light text-sm py-2">
                {/* input and button to subscribe by email */}
                <div className="flex flex-col">
                  <input
                    className="border-2 border-si-olive bg-si-dark text-si-light text-sm rounded-lg px-4 py-2"
                    placeholder="Email Address"
                  />
                  <div className="py-2 flex">
                    {/* todo: grab input and submit this somewhere - do we need some backoff to prevent this getting hammered? */}
                    <button className="flex-grow border-2 border-si-olive text-si-light text-sm px-4 py-2 rounded-lg">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-si-tan text-sm py-4">
            © {Math.max(new Date().getFullYear(), 2024)} SermonIndex
          </p>
        </div>
      </div>
    </footer>
  );
};
