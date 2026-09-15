import Service from "../models/Service.js";

export const createService = asyncHandler(async (req, res) => {
    const { title, description, icon } = req.body;

    if (!title || !description || !icon) {
        throw new ApiError(400, "Please provide both title and description.");
    }

    const service = new Service({ title, description, icon });
    await service.save();

    res.status(201).json(new ApiResponse(201, service, "Service created successfully."));
});


export const getAllServices = asyncHandler(async (req, res) => {
    const services = await Service.findActiveServices();
    res.status(200).json(new ApiResponse(200, services, "Active services fetched successfully."));
})

export const getServiceById = asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id);
    if (!service) {
        throw new ApiError(404, "Service not found.");
    }
    res.status(200).json(new ApiResponse(200, service, "Service fetched successfully."));
})


export const updateService = asyncHandler(async (req, res) => {
    const { title, description, icon } = req.body;
    const service = await Service.findByIdAndUpdate(req.params.id, { title, description, icon }, { new: true, runValidators: true });
    if (!service) {
        throw new ApiError(404, "Service not found.");
    }
    res.status(200).json(new ApiResponse(200, service, "Service updated successfully."));
});


export const deleteService = asyncHandler(async (req, res) => {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
        throw new ApiError(404, "Service not found.");
    }
    res.status(200).json(new ApiResponse(200, null, "Service deleted successfully."));
});

export const toggleServiceStatus = asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id);
    if (!service) {
        throw new ApiError(404, "Service not found.");
    }
    service.isActive = !service.isActive;
    await service.save();
    res.status(200).json(new ApiResponse(200, service, `Service ${service.isActive ? 'activated' : 'deactivated'} successfully.`));
})


