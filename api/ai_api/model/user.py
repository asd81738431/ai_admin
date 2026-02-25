from tortoise import fields
from tortoise.models import Model


class User(Model):
    id = fields.IntField(pk=True, auto_increment=True)
    email = fields.CharField(max_length=255, unique=True)
    password = fields.CharField(max_length=255)
    name = fields.CharField(max_length=255)
    role = fields.CharField(max_length=50, default="user")
    status = fields.CharField(max_length=50, default="active")
    createdAt = fields.DatetimeField(auto_now_add=True)
    updatedAt = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "user"
