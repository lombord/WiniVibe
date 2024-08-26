class ManagerBase:
    _manager_instance = None

    def __new__(cls, *args, **kwargs):
        instance = getattr(cls, "_manager_instance", None)
        if instance is None:
            instance = cls._manager_instance = super().__new__(cls)
        return instance
