from bson import ObjectId

def serialize_doc(doc: dict) -> dict:
    if not doc:
        return doc
    res = dict(doc)
    if "_id" in res:
        str_id = str(res["_id"])
        res["_id"] = str_id
        res["id"] = str_id
    for k, v in res.items():
        if isinstance(v, ObjectId):
            res[k] = str(v)
    return res

def serialize_docs(docs: list) -> list:
    return [serialize_doc(d) for d in docs]
