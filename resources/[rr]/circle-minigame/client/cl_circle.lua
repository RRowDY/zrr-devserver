local promise = nil

local function createCircle(callback, amountOfCircles, seconds)
    if (amountOfCircles == nil or amountOfCircles < 1) then amountOfCircles = 1 end
    if (seconds == nil or seconds < 1) then seconds = 10 end

    promise = promise.new()
    SendNUIMessage({
        action = "minigame-start",
        amountOfCircles = amountOfCircles,
        time = seconds
    })
    SetNuiFocus(true, true)

    local result = Citizen.Await(promise)
    callback(result)
end
exports("createCircle", createCircle)

RegisterNUICallback("minigame-fail", function(data, callback)
    promise:resolve(false)
    promise = nil

    setNuiFocus(false, false)
    callback("ok")
end)

RegisterNUICallback("minigame-success", function(data, callback)
    promise:resolve(true)
    promise = nil

    setNuiFocus(false, false)
    callback("ok")
end)