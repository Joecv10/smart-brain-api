const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const handleAPICall = (req, res) => {
  const { imgURL } = req.body;

  const PAT = process.env.API_KEY;
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = process.env.API_USER;
  const APP_ID = "test";
  // Change these to whatever model and image URL you want to use
  const MODEL_ID = "face-detection";
  const IMAGE_URL = imgURL;

  const stub = ClarifaiStub.grpc();

  // This will be used by every Clarifai endpoint call
  const metadata = new grpc.Metadata();
  metadata.set("authorization", "Key " + PAT);

  stub.PostModelOutputs(
    {
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      model_id: MODEL_ID,
      inputs: [
        { data: { image: { url: IMAGE_URL, allow_duplicate_url: true } } },
      ],
    },
    metadata,
    (err, response) => {
      if (err) {
        throw new Error(err);
      }

      if (response.status.code !== 10000) {
        throw new Error(
          "Post model outputs failed, status: " + response.status.description
        );
      }

      // Since we have one input, one output will exist here
      const regions = response.outputs[0].data.regions;

      res.json(regions);
    }
  );
};

const handleImage = (req, res, dB) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Missing user id in request body" });
  }

  dB("users")
    .where({ id: id })
    .increment({
      entries: 1,
    })
    .returning("entries")
    .then((entries) => res.json(entries[0].entries))
    .catch((err) => res.status(400).json("Unable to get entries"));
};

module.exports = {
  handleImage: handleImage,
  handleAPICall: handleAPICall,
};
