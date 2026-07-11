package com.farmtwin.controller;

import com.farmtwin.model.YieldRequest;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/yield")
@CrossOrigin(origins = "*")
public class YieldController {

    @PostMapping("/predict")
    public Map<String, Object> predict(@RequestBody YieldRequest request) {

        double prediction =
                request.getFarmArea() * 2.5 +
                request.getFertilizer() * 0.02;

        Map<String, Object> response = new HashMap<>();
        response.put("predictedYield", prediction);
        response.put("unit", "tons/hectare");

        return response;
    }
}
