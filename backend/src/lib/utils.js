export const apiResponse = (res, data) => {
  const result = {
    success: data.success || true,
    status: data.status || 200,
    message: data.message,
    pagination: data?.pagination && {
      current: data?.pagination?.current,
      total: data?.pagination?.total,
      next: data?.pagination?.next,
      prev: data?.pagination?.prev,
      records: data?.pagination?.records,
    },
    data: data.data,
  };

  res.status(result.status).json(result);
};
