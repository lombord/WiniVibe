


class SerializerExtraArgs:
    serializer_kwargs = {}

    def get_serializer_kwargs(self) -> dict[str]:
        return self.serializer_kwargs

    def get_serializer(self, *args, **kwargs):
        kwargs.update(self.get_serializer_kwargs())
        return super().get_serializer(*args, **kwargs)

