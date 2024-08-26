import { Form, createSection } from "@/components/base/Form";

const structure = createSection({
  nested: {
    profile: {
      fields: {
        header_image: {
          widget: {
            type: "image",
            props: {
              cropSize: [1550, 375],
              uploadTo: "user-profile/banner",
            },
          },
          isRequired: false,
        },
        photo: {
          widget: {
            type: "image",
            props: {
              uploadTo: "user-profile/photo",
            },
          },
          isRequired: false,
        },
      },
    },
  },
});

const PlaylistsPage = () => {
  return (
    <div>
      <h1 className="text-center text-primary">PlaylistsPage11</h1>
      <Form
        className="mx-auto p-2"
        structure={structure}
        config={{
          url: "profile/",
          method: "patch",
        }}
      />
    </div>
  );
};

export default PlaylistsPage;
