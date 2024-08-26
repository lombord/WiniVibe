from functools import wraps
from typing import Callable
from rest_framework.generics import GenericAPIView


def nested_action(
    wrap_method: Callable | None = None, *, action: str = None, fetch_root=True
):
    """Nested action decorator for nested viewsets"""

    def decorator(method: Callable):

        @wraps(method)
        def wrapper(self: NestedViewSetMixin, request, *args, **kwargs):
            self._is_nested = True
            if fetch_root:
                self.set_root_obj()
            self.init_nested_action(action or method.__name__)
            return method(self, request, *args, **kwargs)

        return wrapper

    if wrap_method is not None and callable(wrap_method):
        return decorator(wrap_method)

    return decorator


class NestedViewSetMixin(GenericAPIView):
    root_obj_name: str = "root"
    root_action_name: str = "root"
    _is_nested: bool

    # dynamic patterns for nested actions
    ROOT_OBJ_PAT = "root_for_%s"
    QS_PAT = "%s_queryset"
    LOOKUP_PAT = "set_%s_lookup"
    OBJ_PAT = "%s_object"
    SER_PAT = "%s_serializer"
    SER_CLASS_PAT = "%s_ser_class"
    CREATE_PAT = "%s_create"
    UPDATE_PAT = "%s_update"
    DESTROY_PAT = "%s_destroy"

    def init_nested_action(self, action: str):
        self.__nested_action = action
        self.__nested_inited = True

    @property
    def nested_action(self) -> str | None:
        try:
            return self.__nested_action
        except AttributeError:
            return None

    @property
    def nested_initialized(self) -> bool:
        try:
            return self.__nested_inited
        except AttributeError:
            return None

    @property
    def is_nested(self) -> bool:
        return getattr(self, "_is_nested", False)

    @property
    def current_action(self) -> str:
        return self.nested_action or self.root_action_name

    def nested_dispatcher(self, pat: str, default, *args, **kwargs):
        return getattr(self, pat % self.current_action, default)(*args, **kwargs)

    def root_for_nested(self):
        return super().get_object()

    def queryset_for_nested(self):
        return super().get_queryset()

    def set_root_obj(self):
        obj = self.nested_dispatcher(self.ROOT_OBJ_PAT, self.root_for_nested)
        setattr(self, self.root_obj_name, obj)
        return obj

    def get_queryset(self):
        if self.is_nested and not self.nested_initialized:
            return self.queryset_for_nested()
        return self.nested_dispatcher(self.QS_PAT, super().get_queryset)

    def _set_def_lookup(self):
        self.lookup_field = "pk"
        self.lookup_url_kwarg = "pk"

    def set_nested_lookup(self):
        self.dynamic_call(self.LOOKUP_PAT, self._set_def_lookup)

    def get_object(self):
        if self.is_nested:
            self.set_nested_lookup()
        return self.nested_dispatcher(self.OBJ_PAT, super().get_object)

    def get_serializer_class(self):
        return self.nested_dispatcher(self.SER_CLASS_PAT, super().get_serializer_class)

    def get_serializer(self, *args, **kwargs):
        return self.nested_dispatcher(
            self.SER_PAT, super().get_serializer, *args, **kwargs
        )

    def perform_create(self, serializer):
        self.nested_dispatcher(self.CREATE_PAT, super().perform_create, serializer)

    def perform_update(self, serializer):
        self.nested_dispatcher(self.UPDATE_PAT, super().perform_update, serializer)

    def perform_destroy(self, instance):
        self.nested_dispatcher(self.DESTROY_PAT, super().perform_destroy, instance)
